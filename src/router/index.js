import Vue from "vue";
import VueRouter from "vue-router";
import PageContent from "../views/PageContent.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "accueil",
    component: PageContent,
  },
  {
    path: "/:slug",
    name: "page",
    component: PageContent,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
