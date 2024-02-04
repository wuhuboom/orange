import { defineStore } from "pinia"; //引入pinia
import http from "@/utils/axios";

export const useStore = defineStore("store", {
  state: () => {
    return {
      balance: "0.0",
      showLeftNav: false,
      isRefreshVerifyCode: false,
      accountInfo: {},
    };
  },
  actions: {
    getUserInfo() {
      http.get("/player/player_info").then((res) => {
        this.accountInfo = res;
      });
    },
  },
});
