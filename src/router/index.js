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
          path: "contest",
          name: "contest",
          meta: {
            parentName: "contest",
          },
          component: () => import("../views/contest.vue"),
        },
        {
          path: "betPage",
          name: "betPage",
          meta: {
            parentName: "contest",
          },
          component: () => import("../views/betPage.vue"),
        },
      ],
    },
  ],
});

export default router;
