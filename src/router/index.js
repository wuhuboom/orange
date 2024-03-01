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
          path: "sysNotice",
          name: "sysNotice",
          meta: {
            parentName: "home",
          },
          component: () => import("../views/sysNotice.vue"),
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
          path: "order",
          name: "order",
          meta: {
            parentName: "order",
          },
          component: () => import("../views/order.vue"),
        },
        {
          path: "tradingOrder",
          name: "tradingOrder",
          meta: {
            parentName: "tradingOrder",
          },
          component: () => import("../views/tradingOrder.vue"),
        },
        {
          path: "safe",
          name: "safe",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/safe.vue"),
        },
        {
          path: "send",
          name: "send",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/send.vue"),
        },
        {
          path: "transfer",
          name: "transfer",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/transfer.vue"),
        },
        {
          path: "buy",
          name: "buy",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/buy.vue"),
        },
        {
          path: "purchaseAmount",
          name: "purchaseAmount",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/purchaseAmount.vue"),
        },
        {
          path: "confirmBuy",
          name: "confirmBuy",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/confirmBuy.vue"),
        },
        {
          path: "successfulArrival",
          name: "successfulArrival",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/successfulArrival.vue"),
        },
        {
          path: "cancelOrder",
          name: "cancelOrder",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/cancelOrder.vue"),
        },
        {
          path: "orderStatus",
          name: "orderStatus",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/orderStatus.vue"),
        },
        {
          path: "recharge",
          name: "recharge",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/recharge.vue"),
        },
        {
          path: "frecharge",
          name: "frecharge",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/footballRecharge.vue"),
        },
        {
          path: "swapInfo",
          name: "swapInfo",
          meta: {
            parentName: "safe",
          },
          component: () => import("../views/swapInfo.vue"),
        },
        {
          path: "withdraw",
          name: "withdraw",
          meta: {
            parentName: "",
          },
          component: () => import("../views/withdraw.vue"),
        },
        {
          path: "result",
          name: "result",
          meta: {
            parentName: "",
          },
          component: () => import("../views/result.vue"),
        },
        {
          path: "fundsRecords",
          name: "fundsRecords",
          meta: {
            parentName: "",
          },
          component: () => import("../views/fundsRecords.vue"),
        },
        {
          path: "rebateReport",
          name: "rebateReport",
          meta: {
            parentName: "",
          },
          component: () => import("../views/rebateReport.vue"),
        },
        {
          path: "personalInfomation",
          name: "personalInfomation",
          meta: {
            parentName: "",
          },
          component: () => import("../views/personalInfomation.vue"),
        },
        {
          path: "cardManage",
          name: "cardManage",
          meta: {
            parentName: "",
          },
          component: () => import("../views/cardManage.vue"),
        },
        {
          path: "invite",
          name: "invite",
          meta: {
            parentName: "",
          },
          component: () => import("../views/invite.vue"),
        },
        {
          path: "addWalletAddress",
          name: "addWalletAddress",
          meta: {
            parentName: "",
          },
          component: () => import("../views/addWalletAddress.vue"),
        },
        {
          path: "addBankCard",
          name: "addBankCard",
          meta: {
            parentName: "",
          },
          component: () => import("../views/addBankCard.vue"),
        },
        {
          path: "addWallet",
          name: "addWallet",
          meta: {
            parentName: "",
          },
          component: () => import("../views/addWallet.vue"),
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
