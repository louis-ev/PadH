<template>
  <div class="_imageBox">
    <img
      v-if="active_image"
      :src="active_image.href"
      :alt="active_image.text"
      :title="active_image.title"
    />
  </div>
</template>
<script>
export default {
  props: {
    images: Array,
    currently_active_image: [Boolean, String],
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    active_image() {
      if (this.currently_active_image)
        return this.images.find((i) => i.href === this.currently_active_image);
      return false;
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
._imageBox {
  background: #eee;
  position: absolute;
  inset: 0;
  overflow: hidden;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    object-fit: scale-down;
    object-position: center center;
  }
}
</style>
