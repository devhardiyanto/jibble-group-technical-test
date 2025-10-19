import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import { BProgress } from "@bprogress/core"; // ✅ core, bukan composable

import home from "@/router/home";

const routes: RouteRecordRaw[] = [
  ...home
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.name) BProgress.start();
  next();
});

router.afterEach(() => {
  BProgress.done(); // (alias `done()` = stop)
});

export default router;
