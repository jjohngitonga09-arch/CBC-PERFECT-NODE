import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import sw from './locales/sw.json'

i18n.use(initReactI18next).init({
 resources: { en: { translation: en }, sw: { translation: sw } },
 lng: localStorage.getItem('eduapp_lang') || 'en',
 fallbackLng: 'en',
 interpolation: { escapeValue: false }
})

i18n.on('languageChanged', lng => localStorage.setItem('eduapp_lang', lng))

export default i18n
