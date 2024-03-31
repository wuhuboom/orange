import { defineStore } from "pinia"; //引入pinia
import http from "@/utils/axios";

export const useStore = defineStore("store", {
  state: () => {
    return {
      balance: "0.0",
      showLeftNav: false,
      isRefreshVerifyCode: false,
      showNoticeId:'',
      accountInfo: {},
    };
  },
  actions: {
    async getUserInfo() {
      // http.get("/player/player_info").then((res) => {
      //   this.accountInfo = res;
      //   localStorage.setItem("accountInfo", JSON.stringify(res));
      // });
      const res = await http.get("/player/player_info")
      if(res){
        const account = localStorage.getItem("accountInfo");
        if(!account){
          this.accountInfo = res
          localStorage.setItem("accountInfo", JSON.stringify(this.accountInfo));
        }else if(res.balance >= 0){
          this.accountInfo = res
          localStorage.setItem("accountInfo", JSON.stringify(this.accountInfo));
        }
        
      }
    },
    changeShowNotice(id) {
      this.showNoticeId = id
    },
  },
});
