<template>
  <div>
    <div v-if="!md_text">N’a pas pu charger</div>
    <div v-else v-html="md_text" />
  </div>
</template>
<script>
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export default {
  props: {
    page: [Boolean, Object],
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
  },
  methods: {},
};
</script>
<style lang="scss" scoped></style>
