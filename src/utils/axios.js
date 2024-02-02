import axios from "axios";
import { showToast } from "vant";
import i18n from "@/i18n/i18n";

const t = i18n.global.t;
// console.log("import.meta.env", import.meta.env);
let { VITE_BASE_URL } = import.meta.env;

let baseURL = VITE_BASE_URL;

const http = axios.create({
  baseURL,
  timeout: 5000,
});
// 请求拦截器
http.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    if (localStorage.getItem("userInfo")) {
      config.headers["token"] = JSON.parse(
        localStorage.getItem("userInfo")
      )?.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    let { code, data, msg } = response.data;
    // console.log(
    //   "%c code: ",
    //   "background-color: #3756d4; padding: 4px 8px; border-radius: 2px; font-size: 14px; color: #fff; font-weight: 700;",
    //   code
    // );
    let msgKey;
    if (code === 200) {
      return data;
    } else if (code === 103) {
      if (data.length > 0) {
        msgKey = `backapi.${data[0].msgKey}`;
        showToast(t(msgKey));
      }
      if (data[0].msgKey == "codeTimeOut") {
        return code;
      }
    } else if (code === 105) {
      let count = "";
      if (data.length === 3) {
        let msgStr = data[0].msgKey;
        let timeStr = data[1].msgKey;
        let failStr = data[2].value;
        let showMsg =
          t(`backapi.${msgStr}`) +
          failStr +
          t(`backapi.pwdErrorCountRight`) +
          " " +
          t(`backapi.waittime1`) +
          " " +
          timeStr +
          " " +
          t(`backapi.waittime2`);
        showToast(showMsg);
      } else if (data.length === 2) {
        msgKey = `backapi.${data[0].msgKey}`;
        if (data[1].name === "failCount") {
          count = data[1].value;
        }
        showToast(t(msgKey, { N: count }));
      }
    } else if (code === 402) {
      showToast(msg);
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
