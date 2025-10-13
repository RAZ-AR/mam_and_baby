import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import sr from './locales/sr-Latn/common.json';
import ru from './locales/ru/common.json';
import en from './locales/en/common.json';

const resources = {
  'sr-Latn': { common: sr },
  ru: { common: ru },
  en: { common: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.startsWith('ru') ? 'ru' : navigator.language.startsWith('en') ? 'en' : 'sr-Latn',
    fallbackLng: 'sr-Latn',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
