<template>
  <div id="app">
    <transition name="pagechange" mode="out-in">
      <router-view
        v-if="!is_loading"
        :key="$route.path"
        :nav_menu="nav_menu"
        :page="current_content"
        :corpora_data="corpora_data"
      />
    </transition>
  </div>
</template>
<script>
const parseTOML = require("@iarna/toml/parse-string");
const Papa = require("papaparse");
// const csvToJson = require("convert-csv-to-json");

export default {
  props: {},
  components: {},
  data() {
    return {
      is_loading: true,
      pages: undefined,
      publicPath: process.env.BASE_URL,
      corpora_data: undefined,
    };
  },
  async created() {
    const doc = await this.fetchDoc();
    const pages = await this.formatDoc(doc);
    this.pages = pages;

    await this.loadArchive();
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
        return this.pages
          .filter((p) => !p.invisible_dans_menu)
          .map((p) => {
            return {
              path: p.url,
              name: p.nom_de_page,
            };
          });
      return [];
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
    async loadArchive() {
      const url = this.publicPath + "/shaping_archive.csv";

      const parseFile = (url) => {
        return new Promise((resolve) => {
          Papa.parse(url, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => {
              resolve(results.data);
            },
            transform: (val, col) => {
              if (col === "collections") return JSON.parse(val);
              if (col === "thumbs") {
                const i = JSON.parse(val);
                const p = i[0];
                if (p && p.thumbsData && p.thumbsData[0])
                  return (
                    "https://corpora.medialab.sciences-po.fr/" +
                    p.thumbsData[0].path
                  );
                return "";
              }

              return val;
            },
          });
        });
      };
      const parsedData = await parseFile(url);
      this.corpora_data = parsedData;
    },
  },
};
</script>
<style lang="scss">
:root {
  --body-bg: rgb(229, 229, 222);
  --spacing: 1rem;
}

html,
body {
  background: white;
  height: 100%;
  margin: 0;
  font-family: "Epilogue";
  font-weight: 400;
  font-size: 95%;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  height: 100%;
}

nav {
  // padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

h1 {
  font-family: "Syne";
  font-weight: 800;
  font-size: 200%;
  margin-top: calc(var(--spacing) * 3);
}
h2,
h3 {
  font-family: inherit;
  font-weight: 600;
}
hr {
  border: none;
  border-bottom: 2px solid var(--body-bg);
}
button {
  border: none;
  cursor: pointer;
  background: transparent;
  border-radius: 4px;
  background: rgba(222, 222, 222, 0.2);
  padding: calc(var(--spacing) / 2);

  transition: background 0.25s cubic-bezier(0.19, 1, 0.22, 1);

  &:hover {
    background: rgba(222, 222, 222, 0.8);
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
.fade {
  &-enter-active,
  &-leave-active {
    opacity: 1;
    transition: opacity 0.35s cubic-bezier(0.19, 1, 0.22, 1);
  }
  &-enter,
  &-leave-to {
    opacity: 0;
    transition: opacity 0.35s cubic-bezier(0.19, 1, 0.22, 1);
  }
}
</style>
