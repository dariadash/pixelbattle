import { combine, createDomain } from 'effector'
import { User } from './interfaces'
import { $websocketPending, loginFx } from './private'

const d = createDomain()

export const $isAuthorized = d.store(false)

export const $userData = d.store<User>({ id: 0, isActivated: false, email: '' })
export const setUserData = d.event()

export const initApp = d.event()
export const logout = d.event()
export const logoutFx = d.effect()
export const sessionExpired = d.event()

export const $authChecked = d.store(false)
export const $loading = combine(loginFx.pending, $websocketPending, (a, b) => a || b)

export const onSuccessConnect = d.event()
export const setWebsocketPending = d.event<boolean>()
