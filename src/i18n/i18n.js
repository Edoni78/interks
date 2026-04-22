import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import sq from '../locales/sq.json';

const setHtmlLang = (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
};

i18n.use(initReactI18next).init({
  lng: 'sq',
  resources: {
    sq: { translation: sq },
  },
  fallbackLng: 'sq',
  supportedLngs: ['sq'],
  interpolation: { escapeValue: false },
});

setHtmlLang('sq');

i18n.on('languageChanged', (lng) => {
  setHtmlLang(lng);
});

export default i18n;
