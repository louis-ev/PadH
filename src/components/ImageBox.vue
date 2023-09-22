<template>
  <div class="_imageBox">
    <div class="_singleImage">
      <transition name="fade" mode="out-in">
        <div v-if="currently_active_image" :key="currently_active_image.id">
          <a :href="currently_active_image.large_src" target="_blank">
            <img
              :src="currently_active_image.large_src"
              :alt="currently_active_image.text"
              :title="currently_active_image.title"
            />
          </a>
        </div>
        <div v-else key="none" class="_none">Aucune</div>
      </transition>

      <div class="_captionBloc">
        <transition name="fade" mode="out-in">
          <div
            v-if="currently_active_image"
            :key="currently_active_image?.id || 'none'"
            class="_captionBloc--text"
            v-html="currently_active_image.text"
          />
        </transition>
        <div class="_captionBloc--nav">
          <button
            type="button"
            class="u-button"
            :disabled="currently_active_image_index === 0"
            @click="prevImage"
          >
            <b-icon icon="arrow-left-circle" />
          </button>
          <span>
            {{ currently_active_image_index + 1 }}/{{ images.length }}
          </span>
          <button
            type="button"
            class="u-button"
            :disabled="currently_active_image_index >= images.length"
            @click="nextImage"
          >
            <b-icon icon="arrow-right-circle" />
          </button>
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
    </div>

    <transition name="pagechange" mode="out-in">
      <div v-if="show_all_images" class="_allImages">
        <button
          type="button"
          class="u-button _closeBtn"
          @click="show_all_images = false"
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
          <div class="_imageText" v-html="image.text" />
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
  computed: {
    currently_active_image_index() {
      if (!this.currently_active_image) return 0;
      return this.images.findIndex(
        (i) => i.id === this.currently_active_image.id
      );
    },
  },
  methods: {
    toggleImage(id) {
      this.$eventHub.$emit("textBox.scroll_to_btn", id);
      this.$emit("showImage", id);
      this.show_all_images = false;
    },
    prevImage() {
      const new_id = this.images[this.currently_active_image_index - 1].id;
      this.toggleImage(new_id);
    },
    nextImage() {
      const new_id = this.images[this.currently_active_image_index + 1].id;
      this.toggleImage(new_id);
    },
  },
};
</script>
<style lang="scss" scoped>
._imageBox {
  background: var(--body-bg);
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

  // pointer-events: none;

  object-fit: scale-down;
  object-position: center center;
}
._captionBloc {
  position: absolute;
  bottom: calc(var(--spacing) / 2);
  left: calc(var(--spacing) / 2);
  width: calc(100% - calc(var(--spacing) * 2));
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  padding: calc(var(--spacing) / 4);

  font-size: 90%;

  border-radius: 4px;

  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;

  ._captionBloc--text {
    padding: calc(var(--spacing) / 2) calc(var(--spacing) / 2)
      calc(var(--spacing) / 1);
    flex: 1 1 auto;
  }
  ._captionBloc--nav {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: calc(var(--spacing) / 2) calc(var(--spacing) / 4);
    gap: calc(var(--spacing) / 2);
  }

  ._showAllBtn {
    padding: calc(var(--spacing) / 2) calc(var(--spacing) / 4);
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
  align-items: baseline;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));

  ._btnImage {
    position: relative;
    overflow: hidden;
    // aspect-ratio: 1;
    cursor: pointer;
    border: 2px solid white;
    text-align: left;

    &.is--active {
      border-color: var(--color-scipo);
    }
  }

  img {
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;
    height: auto;
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
._imageText {
  margin-top: calc(var(--spacing) / 4);
}

._none {
  padding: calc(var(--spacing) / 2);
}
</style>
