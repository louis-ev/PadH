<template>
  <div class="_textBox">
    <nav class="_menu">
      <div v-for="item in nav_menu" :key="item.path">
        <router-link :to="item.path">{{ item.name }}</router-link>
      </div>
    </nav>
    <div class="_textBox--content">
      <component :is="'style'">
        {{ active_btn_styles }}
      </component>
      <div v-if="!md_text" class="_cantLoad">N’a pas pu charger</div>
      <div ref="content" v-else v-html="md_text" @click="interceptBtn" />
    </div>
  </div>
</template>
<script>
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export default {
  props: {
    nav_menu: Array,
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
    md_text() {
      if (!this.text) return false;

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

        let _list_of_images = [];
        _list_of_images.push({
          id,
          large_src,
          icon_src,
          title,
          text,
        });
        this.$emit("updateListOfImages", _list_of_images);
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
      return marked.parse(this.text, { breaks: true });
    },
    active_btn_styles() {
      if (!this.currently_active_image) return "";
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
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
}
._textBox--content {
  // padding: 1em;
  padding: 0 calc(var(--spacing) * 3);

  ::v-deep button {
    appearance: none;
    outline: none;
    background: transparent;
    border-radius: 0;
    border: 2px solid #eee;
    border-radius: 2px;
    padding: 0;

    cursor: pointer;
    transition: transform 0.6s ease-out;

    &:hover {
      transform: scale(1.5);
    }

    img {
      display: block;
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
  padding: calc(var(--spacing) * 1) calc(var(--spacing) * 3);
  margin-top: calc(var(--spacing) * 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(1px);
  background: linear-gradient(
    to bottom,
    rgb(255, 255, 255) 1em,
    rgba(255, 255, 255, 0.8) 100%
  );
}
</style>
