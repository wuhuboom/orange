import { defineStore } from "pinia"; //引入pinia

export const useStore = defineStore("store", {
  state: () => {
    return {
      balance: "0.0",
      showLeftNav: false,
    };
  },
});
