// i18n configuration for EventPlanner
const translations = {
    en: { appName: 'EventPlanner', description: 'AI event coordinator generating timelines and checklists' },
    de: { appName: 'EventPlanner', description: 'AI event coordinator generating timelines and checklists (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
