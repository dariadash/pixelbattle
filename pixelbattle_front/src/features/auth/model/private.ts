import { AxiosError } from 'axios'
import { createDomain } from 'effector'
import { AuthResponse } from '@/shared/api/types'
import { AuthPage, LoginFxPayload, RegisterFxPayload, SaveTokenFxPayload } from './interfaces'

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
export const saveTokenFx = d.effect<SaveTokenFxPayload, void, Error>()
export const removeTokenFx = d.effect<void, void, Error>()
export const refreshSessionFx = d.effect<void, AuthResponse, AxiosError<any>>()

export const $websocketPending = d.store(false)

export const register = d.event()
export const registerFx = d.effect<RegisterFxPayload, AuthResponse, AxiosError<any>>()

export const setAuthPage = d.event<AuthPage>()
