import { createDomain } from 'effector'
import { User } from './interfaces'

const d = createDomain()

export const $isAuthorized = d.store(false)

export const $userData = d.store<User>({ id: 0, isActivated: false, email: '' })
export const setUserData = d.event()

export const initApp = d.event()
export const logout = d.event()
export const logoutFx = d.effect()

export const onSuccessConnect = d.event()
export const setWebsocketPending = d.event<boolean>()

export const getProfileFx = d.effect<any, any, any>()
