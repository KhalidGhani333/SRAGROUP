import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import it from "./it.json";
import { defaultLang } from "./routes";

// Both bundles are imported statically so initialisation is synchronous on the server and the
// client. The active language always comes from the URL (see useLang), never from global state,
// which keeps concurrent SSR requests in different languages isolated.
if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: { it: { translation: it }, en: { translation: en } },
    lng: defaultLang,
    fallbackLng: defaultLang,
    supportedLngs: ["it", "en"],
    interpolation: { escapeValue: false },
    returnNull: false,
    initAsync: false,
  });
}

export default i18n;
