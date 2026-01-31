import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import bn from "./locales/bn.json";
import ar from "./locales/ar.json";

const resources = {
  en: {
    translation: en,
  },
  bn: {
    translation: bn,
  },
  ar: {
    translation: ar,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false,
    },
  });

// Handle RTL for Arabic
i18n.on("languageChanged", (lng) => {
  const direction = lng === "ar" ? "rtl" : "ltr";
  document.body.dir = direction;
  document.body.style.direction = direction;
});

export default i18n;
