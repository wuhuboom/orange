import axios from "axios";

import { showToast } from "vant";

console.log(import.meta.env);
let { MODE } = import.meta.env;
let origin = location.origin;

let proxyUrl = {
  development: "https://api.uunn.org",
  production: "",
};
// const baseURL = MODE === "development" ? "https://api.uunn.org" : `${origin}`;

//
const http = axios.create({
  baseURL: `/api`,
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
    if (response.status === 200 && response.data.code === 200) {
      return response.data.data;
    } else if (response.data.code === 500) {
      // console.log(response);
      showToast(response.data.msg);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
