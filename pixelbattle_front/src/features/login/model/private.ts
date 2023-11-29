import { AxiosError } from 'axios'
import { createDomain, combine } from 'effector'
import { AuthResponse, LoginFxPayload, RegisterFxPayload, SettingsPage } from './interfaces'

const d = createDomain()

export const $username = d.store('')
export const $email = d.store('')
export const $password = d.store('')

export const setUsername = d.event<string>()
export const setEmail = d.event<string>()
export const setPassword = d.event<string>()

export const login = d.event()

export const loginFx = d.effect<LoginFxPayload, AuthResponse, AxiosError<any>>()
export const loadTokenFx = d.effect<void, string, Error>()
export const saveTokenFx = d.effect<string, string, Error>()
export const removeTokenFx = d.effect<void, void, Error>()

export const $websocketPending = d.store(false)

export const $loading = combine(loginFx.pending, $websocketPending, (a, b) => a || b)

export const register = d.event()
export const registerFx = d.effect<RegisterFxPayload, string, AxiosError<any>>()

export const $settingsPage = d.store<SettingsPage>('login')
export const setSettingsPage = d.event<SettingsPage>()