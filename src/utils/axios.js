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
    if (code === 200) {
      return data;
    } else if (code === 103 || code === 105) {
      if (data.length > 0) {
        let msgKey = `backapi.${data[0].msgKey}`;
        console.log(i18n);
        showToast(t(msgKey));
      }
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
