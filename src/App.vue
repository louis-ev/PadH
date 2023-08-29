<template>
  <div id="app">
    <transition name="pagechange" mode="out-in">
      <router-view
        v-if="!is_loading"
        :key="$route.path"
        :nav_menu="nav_menu"
        :page="current_content"
      />
    </transition>
  </div>
</template>
<script>
const parseTOML = require("@iarna/toml/parse-string");

export default {
  props: {},
  components: {},
  data() {
    return {
      is_loading: true,
      pages: undefined,
    };
  },
  async created() {
    const doc = await this.fetchDoc();
    const pages = await this.formatDoc(doc);
    this.pages = pages;
    this.is_loading = false;
  },
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {
    current_content() {
      if (this.pages) {
        const matching_page = this.pages.find(
          (p) => p.url === this.$route.path
        );
        return matching_page || "no_matching_page";
      }
      return false;
    },
    nav_menu() {
      if (this.pages)
        return this.pages.map((p) => {
          return {
            path: p.url,
            name: p.nom_de_page,
          };
        });
      return false;
    },
  },
  methods: {
    async fetchDoc() {
      const response = await fetch(
        "https://mensuel.framapad.org/p/le0lzttwfn-a2xl/export/txt"
      );
      const text = await response.text();
      return text;
    },
    async formatDoc(text) {
      let t = text.split("[PAGE]");
      return t.map((_t) => parseTOML(_t));
    },
  },
};
</script>
<style lang="scss">
html,
body {
  background: white;
  height: 100%;
  margin: 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.pagechange {
  &-enter-active,
  &-leave-active {
    transform: translateY(0);
    opacity: 1;
    transition: all 0.15s cubic-bezier(0.19, 1, 0.22, 1);
  }
  &-enter,
  &-leave-to {
    transform: translateY(5px);
    opacity: 0;
    transition: all 0.15s cubic-bezier(0.19, 1, 0.22, 1);
  }
}
</style>
