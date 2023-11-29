import { createDomain } from 'effector'
import { ToastFxPayload, ToastPayload } from './types'

const d = createDomain()

export const openToast = d.event<ToastPayload>()
export const openToastsFx = d.effect<ToastFxPayload, any, Error>()