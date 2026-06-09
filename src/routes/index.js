import { createWebHistory, createRouter } from "vue-router";

import HomeView from "../views/HomeView.vue";
import SaleView from "../views/SaleView.vue";
import MemberView from "../views/MemberView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/sale", component: SaleView },
  { path: "/:memberID", component: MemberView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
