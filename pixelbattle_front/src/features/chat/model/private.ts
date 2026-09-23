import { createDomain } from 'effector'
import { Message } from './types'

const d = createDomain()

export const $messages = d.store<Message[]>([])

export const $messageText = d.store('')
export const setMessage = d.event<string>()

export const startSendMessage = d.event()

export const $lastSentAt = d.store(0)

export const setFontSize = d.event<number>()
export const changeFont = d.event()
export const $chatFontSize = d.store<number>(14)
export const $chatFont = d.store(false)