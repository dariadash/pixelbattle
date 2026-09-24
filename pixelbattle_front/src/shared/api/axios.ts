import axios from 'axios'
import { AUTH_TOKEN, REFRESH_TOKEN } from './consts'
import { AuthResponse } from './types'

type SessionExpiredHandler = () => void

let sessionExpiredHandler: SessionExpiredHandler = () => {}

export const setSessionExpiredHandler = (handler: SessionExpiredHandler) => {
    sessionExpiredHandler = handler
}

export const Axios = axios.create({
    baseURL: '/api',
    responseType: 'json',
    withCredentials: true
})

Axios.interceptors.request.use((config) => {
    const bearerToken = localStorage.getItem(AUTH_TOKEN)
    if (bearerToken && config.headers) {
        config.headers.Authorization = `Bearer ${bearerToken}`
    }
    return config
})

const AUTH_ENDPOINTS = ['/login', '/register', '/refresh', '/logout']
const isAuthEndpoint = (url?: string) =>
    !!url && AUTH_ENDPOINTS.some((p) => url.includes(p))

let refreshPromise: Promise<AuthResponse> | null = null

export async function refreshSession() {
    refreshPromise ??= Axios.post('/refresh').then((res) => res.data).finally(() => {
        refreshPromise = null
    })
    const data = await refreshPromise
    localStorage.setItem(AUTH_TOKEN, data.access_token)
    if (data.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN, data.refresh_token)
    }
    return data
}

Axios.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    if (error.response?.status !== 401 || !originalRequest || originalRequest._isRetry || isAuthEndpoint(originalRequest.url)) {
        throw error
    }
    originalRequest._isRetry = true
    try {
        const data = await refreshSession()
        if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        }
        return Axios.request(originalRequest)
    } catch (e) {
        sessionExpiredHandler()
        throw e
    }
})
