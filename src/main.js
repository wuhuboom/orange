import "./styles/main.scss";
import "vant/lib/index.css";
import "swiper/css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import i18n from "./i18n/i18n";

import { Toast } from "vant";
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US'; 
const app = createApp(App);
Locale.use('en-US', enUS);
app.use(Toast);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
