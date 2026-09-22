import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ru',
        supportedLngs: ['ru', 'en'],
        ns: ['translation'],
        defaultNS: 'translation',
        backend: {
            loadPath: 'locales/{{lng}}.json',
        },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'lang',
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    })

const serverMessageMap: Array<{ test: (msg: string) => { key: string, email?: string } | null }> = [
    {
        test: (msg) => {
            const m = /^User with email (.+) already exist$/.exec(msg)
            return m ? { key: 'errors.emailExists', email: m[1] } : null
        },
    },
]

const exactServerMessages: Record<string, string> = {
    'User with this username is not found': 'errors.userNotFound',
    'User with this email is not found': 'errors.userNotFound',
    'Incorrect password': 'errors.incorrectPassword',
    'User is unauthorized': 'errors.unauthorized',
    'Refresh token expired or invalid': 'errors.refreshExpired',
    'User not found.': 'errors.userNotFound',
    'User not found': 'errors.userNotFound',
    'You are not authorized.': 'errors.unauthorized',
    'Authorization failed.': 'errors.authFailed',
}

export function translateServerMessage(message: unknown): string[] {
    const list = Array.isArray(message) ? message : [message]
    return list.map((item) => {
        if (typeof item !== 'string' || !item) {
            return i18n.t('errors.unknown')
        }
        const exact = exactServerMessages[item]
        if (exact) {
            return i18n.t(exact)
        }
        for (const { test } of serverMessageMap) {
            const matched = test(item)
            if (matched) {
                return i18n.t(matched.key, { email: matched.email })
            }
        }
        return item
    })
}

export default i18n
