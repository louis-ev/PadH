<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>

    <!-- <div v-for="(page, index) in pages" :key="index">
      {{ page.nom_de_page }}
      <br />
      {{ page.url }}
      <br />
      {{ page.contenu }}
    </div> -->
    <router-view />
  </div>
</template>
<script>
const parseTOML = require("@iarna/toml/parse-string");

export default {
  props: {},
  components: {},
  data() {
    return {
      pages: undefined,
    };
  },
  async created() {
    const doc = await this.fetchDoc();
    const pages = await this.formatDoc(doc);
    this.pages = pages;
  },
  mounted() {},
  beforeDestroy() {},
  watch: {},
  computed: {},
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
      debugger;
      return t.map((_t) => parseTOML(_t));
    },
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
</style>
