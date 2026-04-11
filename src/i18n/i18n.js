import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en.json';
import sq from '../locales/sq.json';

const setHtmlLang = (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sq: { translation: sq },
    },
    fallbackLng: 'sq',
    supportedLngs: ['sq', 'en'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'interks-lang',
    },
  })
  .then(() => {
    setHtmlLang(i18n.language);
  });

i18n.on('languageChanged', (lng) => {
  setHtmlLang(lng);
});

export default i18n;
