<template>
  <div class="_textBox">
    <div ref="content" v-html="text" @click="interceptBtn" />
    {{ currently_active_image }}
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
  computed: {},
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

      if (btn.scrollIntoViewIfNeeded) btn.scrollIntoViewIfNeeded();
      else btn.scrollIntoView();
    },
  },
};
</script>
<style lang="scss" scoped>
._textBox {
  // padding: 1em;
}
</style>
