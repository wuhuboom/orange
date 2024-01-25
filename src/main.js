import "./styles/main.css";
import "vant/lib/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import i18n from "./i18n/i18n";

import { Toast } from "vant";

const app = createApp(App);

app.use(Toast);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
