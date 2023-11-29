import { createDomain } from 'effector'
import { Message } from './types'

const d = createDomain()

export const $messages = d.store<Message[]>([])

export const $messageText = d.store('')
export const setMessage = d.event<string>()

export const startSendMessage = d.event()
