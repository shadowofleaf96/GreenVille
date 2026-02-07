import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
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
      htmlTag:
        typeof document !== "undefined" ? document.documentElement : null,
      cookieOptions: { path: "/", sameSite: "strict" },

      convertDetectedLanguage: (lng) => {
        const langCode = lng.split("-")[0];
        return ["en", "ar", "fr"].includes(langCode) ? langCode : "en";
      },
    },
  });

const loadRemoteTranslations = async (lng) => {
  if (typeof window === "undefined" || !lng) return;
  const lang = lng.split("-")[0];
  try {
    const response = await fetch(`${backendUrl}/v1/locales/${lang}`);
    if (response.ok) {
      const remoteData = await response.json();
      if (Object.keys(remoteData).length > 0) {
        i18n.addResourceBundle(lang, "translation", remoteData, true, true);
      }
    }
  } catch (error) {
    console.error(`Error loading remote translations for ${lang}:`, error);
  }
};

i18n.on("languageChanged", (lng) => {
  loadRemoteTranslations(lng);
});

// Initial load
const initialLang = i18n.language || "en";
loadRemoteTranslations(initialLang);

export default i18n;
