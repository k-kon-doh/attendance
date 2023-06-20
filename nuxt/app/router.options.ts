import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  routes: (routes) => [
    ...routes,
    {
      path: "/attendances",
      component: () => import("~/pages/attendances/list.vue"),
    },
    {
      path: "/attendances/:id",
      component: () => import("~/pages/attendances/[id]/show.vue"),
    },
  ],
};
