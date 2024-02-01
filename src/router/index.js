import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home", // 设置重定向到'/home'
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/register.vue"),
    },
    {
      path: "/forgotPwd",
      name: "forgotPwd",
      component: () => import("../views/forgotPwd.vue"),
    },
    {
      path: "/",
      name: "layout",
      component: () => import("../views/layout.vue"),
      children: [
        {
          path: "home",
          name: "home",
          meta: {
            parentName: "home",
          },
          component: () => import("../views/home.vue"),
        },
        {
          path: "match",
          name: "match",
          meta: {
            parentName: "match",
          },
          component: () => import("../views/match.vue"),
        },
        {
          path: "betPage",
          name: "betPage",
          meta: {
            parentName: "match",
          },
          component: () => import("../views/betPage.vue"),
        },
        {
          path: "sysNotice",
          name: "sysNotice",
          meta: {
            parentName: "home",
          },
          component: () => import("../views/sysNotice.vue"),
        },
        {
          path: "partner",
          name: "partner",
          meta: {
            parentName: "partner",
          },
          component: () => import("../views/partner.vue"),
        },
      ],
    },
  ],
});

export default router;
