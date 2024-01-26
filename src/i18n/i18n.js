import { createI18n } from "vue-i18n";

import en from "./en.json";
import de from "./de.json";
import es from "./es.json";
import fr from "./fr.json";
import ins from "./ins.json";
import zh from "./zh.json";
import deal from "./deal.json";
// 创建 i18n 实例
const i18n = createI18n({
  locale: localStorage.getItem("lang") || "en", // 设置默认语言
  fallbackLocale: "en", // 设置回退语言
  legacy: true,
  allowComposition: true, //允许组合式api使用
  messages: {
    en: { ...en, ...deal.en },
    de: { ...de, ...deal.de },
    es: { ...es, ...deal.es },
    fr: { ...fr, ...deal.fr },
    ins: { ...ins, ...deal.ins },
    zh: { ...zh, ...deal.zh },
  },
  // 其他配置
});

export default i18n;
