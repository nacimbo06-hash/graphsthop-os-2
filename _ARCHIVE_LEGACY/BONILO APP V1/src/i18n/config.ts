import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frTranslations from './locales/fr.json';

const resources = {
    fr: {
        translation: frTranslations,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'fr', // French only
        fallbackLng: 'fr',

        interpolation: {
            escapeValue: false, // React already escapes
        },

        react: {
            useSuspense: false,
        },
    });

// Set document direction to LTR for French
document.documentElement.setAttribute('dir', 'ltr');
document.documentElement.setAttribute('lang', 'fr');

export default i18n;
