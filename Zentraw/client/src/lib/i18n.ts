import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import es from '../locales/es.json';
import ja from '../locales/ja.json';
import zh from '../locales/zh.json';
import ru from '../locales/ru.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      es: { translation: es },
      ja: { translation: ja },
      zh: { translation: zh },
      ru: { translation: ru },
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;