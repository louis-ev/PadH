<template>
  <div class="_pageContent">
    <div class="_twoRows">
      <div class="_images">
        <ImageBox
          :images="list_of_images"
          :currently_active_image="currently_active_image"
          @showImage="showImage"
        />
      </div>
      <div class="_text">
        <TextBox
          :nav_menu="nav_menu"
          :text="page.contenu"
          :currently_active_image="currently_active_image"
          @updateListOfImages="updateListOfImages"
          @showImage="showImage"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ImageBox from "@/components/ImageBox.vue";
import TextBox from "@/components/TextBox.vue";

export default {
  props: {
    nav_menu: [Array],
    page: [Boolean, Object],
  },
  components: {
    ImageBox,
    TextBox,
  },
  data() {
    return {
      list_of_images: [],
      currently_active_image_id: false,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    currently_active_image() {
      if (this.currently_active_image_id === false)
        return this.list_of_images[0];
      return this.list_of_images.find(
        (i) => i.id === this.currently_active_image_id
      );
    },
  },
  methods: {
    updateListOfImages(list_of_images) {
      this.list_of_images = list_of_images;
    },
    showImage(id) {
      this.currently_active_image_id =
        this.currently_active_image_id === id ? false : id;
    },
  },
};
</script>
<style lang="scss" scoped>
._pageContent {
  height: 100%;
}

._twoRows {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;

  > * {
    flex: 0 0 50%;
  }
}

._images {
  position: relative;
  overflow: hidden;
}

._text {
}
._cantLoad {
  padding: calc(var(--spacing) * 2);
}
</style>
