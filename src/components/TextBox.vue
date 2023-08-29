<template>
  <div class="_textBox">
    <div v-html="text" @click="interceptBtn" />
  </div>
</template>
<script>
export default {
  props: {
    text: String,
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
  methods: {
    interceptBtn($event) {
      const imagetodisplay = $event.target.dataset?.imagetodisplay;
      imagetodisplay;
      this.$emit("showImage", imagetodisplay);
    },
  },
};
</script>
<style lang="scss" scoped>
._textBox {
  // padding: 1em;
}
</style>
