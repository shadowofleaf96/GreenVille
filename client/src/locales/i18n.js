import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import ar from "./ar.json";
import fr from "./fr.json";

i18n
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
    },
    fallbackLng: "en", 
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ["localStorage", "cookie"],
      excludeCacheFor: ["cimode"],
      cookieMinutes: 10,
      cookieDomain: "myDomain",
      htmlTag: document.documentElement,
      cookieOptions: { path: "/", sameSite: "strict" },

      convertDetectedLanguage: (lng) => {
        const langCode = lng.split("-")[0];
        return ["en", "ar", "fr"].includes(langCode) ? langCode : "en";
      },
    },
  });

export default i18n;
