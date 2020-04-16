import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationFI from './locales/fi/translation.json';

const lng = localStorage.getItem('language') ? JSON.parse(localStorage.getItem('language')) : 'en';

// the translations
const resources = {
    fi: {
        translation: translationFI
    }
}

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng,

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;