<template>
  <div class="_textBox">
    <component :is="'style'">
      {{ active_btn_styles }}
    </component>
    <div ref="content" v-html="text" @click="interceptBtn" />
  </div>
</template>
<script>
export default {
  props: {
    text: String,
    currently_active_image: [Boolean, Object],
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {
    currently_active_image() {
      if (this.currently_active_image)
        this.scrollToBtn(this.currently_active_image.id);
    },
  },
  computed: {
    active_btn_styles() {
      return `
      button[data-imagetodisplay="${this.currently_active_image.id}"] {
        border-color: rebeccapurple !important;
      }
      `;
    },
  },
  methods: {
    interceptBtn($event) {
      const imagetodisplay = $event.target.dataset?.imagetodisplay;
      if (imagetodisplay) this.$emit("showImage", imagetodisplay);
    },
    scrollToBtn(id) {
      const btn = this.$refs.content.querySelector(
        `[data-imagetodisplay=${id}]`
      );
      if (!btn) return false;

      const scrollBox = this.$refs.content.closest("._text");
      scrollBox.scrollTo(0, btn.offsetTop - 60);
    },
  },
};
</script>
<style lang="scss" scoped>
._textBox {
  // padding: 1em;
  padding: 0 calc(var(--spacing) * 2);

  ::v-deep button {
    appearance: none;
    outline: none;
    background: transparent;
    border-radius: 0;
    border: 1px solid #eee;
    border-radius: 2px;
    padding: 0;

    cursor: pointer;

    img {
      display: block;
      pointer-events: none;

      width: auto;
      height: 1.3em;
    }
  }
}
</style>
