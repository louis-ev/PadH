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
        <div class="_text--content">
          <nav class="_menu">
            <div v-for="item in nav_menu" :key="item.path">
              <router-link :to="item.path">{{ item.name }}</router-link>
            </div>
          </nav>
          <div v-if="!md_text">N’a pas pu charger</div>
          <TextBox
            v-else
            :text="md_text"
            :currently_active_image="currently_active_image"
            @showImage="showImage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

import ImageBox from "@/components/ImageBox.vue";
import TextBox from "@/components/TextBox.vue";

export default {
  props: {
    nav_menu: [Boolean, Array],
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
    md_text() {
      if (!this.page.contenu) return false;

      const renderer = new marked.Renderer();
      const linkRenderer = renderer.link;
      renderer.link = (href, title, text) => {
        const localLink = href.startsWith(
          `${location.protocol}//${location.hostname}`
        );
        const html = linkRenderer.call(renderer, href, title, text);
        return localLink
          ? html
          : html.replace(
              /^<a /,
              `<a rel="noreferrer noopener nofollow" target="_blank" `
            );
      };
      const imageRenderer = renderer.image;
      renderer.image = (href, title, text) => {
        let icon_src, large_src;
        if (href.includes(">")) {
          const srcs = href.split(">");
          icon_src = srcs[0];
          large_src = srcs[1];
        } else {
          icon_src = large_src = href;
        }
        const id = "id" + Math.random().toString(16).slice(2);

        this.list_of_images.push({
          id,
          large_src,
          icon_src,
          title,
          text,
        });
        const html_image = imageRenderer.call(renderer, icon_src, title, text);
        let html_btn_image = `<button type="button" data-imageToDisplay="${id}">${html_image}</button>`;
        return html_btn_image;
      };
      marked.use({ renderer });

      const hooks = {
        postprocess(html) {
          return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
        },
      };
      marked.use({ hooks });

      // return marked.parse(`<img src="x" onerror="alert('not happening')">`);
      return marked.parse(this.page.contenu, { breaks: true });
    },
    currently_active_image() {
      if (this.currently_active_image_id === false)
        return this.list_of_images[0];
      return this.list_of_images.find(
        (i) => i.id === this.currently_active_image_id
      );
    },
  },
  methods: {
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
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
}
._text--content {
  padding: 3em;

  ::v-deep button {
    cursor: pointer;
    img {
      display: inline-block;
      pointer-events: none;

      width: auto;
      height: 1em;
    }
  }
}

._menu {
  position: sticky;
  top: 0;
  display: flex;
  padding: 0;
  gap: 1em;
}
</style>
