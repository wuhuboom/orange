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
    // config.headers["language"] = localStorage.getItem("lang") || "en";
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
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
    let msgKey;
    if (code === 200) {
      return data;
    } else if (code === 103) {
      if (data.length > 0) {
        msgKey = `backapi.${data[0].msgKey}`;
        showToast(t(msgKey));
      }
    } else if (code === 105) {
      let count = "";
      if (data.length === 3) {
        let msgStr = currData[0].msgKey;
        let timeStr = currData[1].msgKey;
        let failStr = currData[2].value;
        showMsg =
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
        console.log(count);
        showToast(t(msgKey, { N: count }));
      }
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
