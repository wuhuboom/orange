import { createI18n } from "vue-i18n";

import en from "./en";
import de from "./de";
import es from "./es";
import fr from "./fr";
import ins from "./ins";
// 创建 i18n 实例
const i18n = createI18n({
  locale: localStorage.getItem("lang") || "en", // 设置默认语言
  fallbackLocale: "en", // 设置回退语言
  legacy: true,
  allowComposition: true, //允许组合式api使用
  messages: {
    en,
    de,
    es,
    fr,
    ins
  },
  // 其他配置
});

export default i18n;