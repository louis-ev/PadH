<template>
  <div class="_imageBox">
    <div class="_singleImage">
      <transition name="fade_fast" mode="out-in">
        <div v-if="currently_active_image" :key="currently_active_image.id">
          <img
            :src="currently_active_image.large_src"
            :alt="currently_active_image.text"
            :title="currently_active_image.title"
          />
        </div>
        <div v-else key="none">Aucune</div>
      </transition>

      <transition name="fade_fast" mode="out-in">
        <div
          v-if="currently_active_image"
          :key="currently_active_image?.id || 'none'"
          class="_captionBloc"
        >
          <div class="_captionBloc--text">
            {{ currently_active_image.text }}
          </div>
          <div class="_showAllBtn">
            <button
              type="button"
              class="u-button"
              @click="show_all_images = true"
            >
              <b-icon icon="grid-3x3-gap" />
            </button>
          </div>
        </div>
      </transition>
    </div>

    <transition name="pagechange" mode="out-in">
      <div v-if="show_all_images" class="_allImages">
        <button
          type="button"
          class="u-button _closeBtn"
          @click="show_all_images = true"
        >
          <b-icon icon="x-lg" />
        </button>

        <button
          type="button"
          v-for="image in images"
          class="_btnImage"
          :class="{
            'is--active':
              currently_active_image && image.id === currently_active_image.id,
          }"
          :key="image.id"
          @click="toggleImage(image.id)"
        >
          <img :src="image.large_src" :alt="image.text" :title="image.title" />
        </button>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    images: Array,
    currently_active_image: [Boolean, Object],
  },
  components: {},
  data() {
    return {
      show_all_images: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {
    toggleImage(id) {
      this.$emit("showImage", id);
      this.show_all_images = false;
    },
  },
};
</script>
<style lang="scss" scoped>
._imageBox {
  background: #eee;
  width: 100%;
  height: 100vh;
  inset: 0;
  overflow: hidden;
}

._singleImage {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
img {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  pointer-events: none;

  object-fit: scale-down;
  object-position: center center;
}
._captionBloc {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;

  display: flex;
  flex-flow: row nowrap;

  ._captionBloc--text {
    padding: calc(var(--spacing) / 2) var(--spacing);
    flex: 1 1 auto;
  }
  ._showAllBtn {
    padding: calc(var(--spacing) / 2) var(--spacing);

    flex: 0 0 auto;
  }
}

._allImages {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(238, 238, 238, 0.9);

  overflow: auto;
  padding: var(--spacing);

  display: grid;
  grid-auto-rows: max-content;
  grid-gap: calc(var(--spacing) / 1);
  align-items: stretch;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));

  ._btnImage {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1;
    cursor: pointer;
    border: 2px solid white;

    &.is--active {
      border-color: rebeccapurple;
    }
  }

  img {
    position: absolute;
  }
}
._closeBtn {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  padding: calc(var(--spacing) * 1);
  z-index: 1;
  backdrop-filter: blur(2px);
}
</style>
