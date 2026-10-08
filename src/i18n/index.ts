import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations, Language } from './translations';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translations.en },
    fr: { translation: translations.fr },
    es: { translation: translations.es },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (lang: Language) => {
  i18n.changeLanguage(lang);
};

export default i18n;
