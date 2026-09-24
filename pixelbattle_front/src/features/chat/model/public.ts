import { createDomain } from 'effector'
import { Message } from './types'

const d = createDomain()

export const $chatVisible = d.store(false)
export const $chatSettingsVisible = d.store(false)
export const toggleChat = d.event()
export const toggleSettingsChat = d.event()

export const $messages = d.store<Message[]>([])

export const $unseenChatMessages = d.store(0)

export const sendMessage = d.event<{ userId: number, text: string }>()
export const onNewMessage = d.event<Message>()

export const $chatFontSize = d.store<number>(14)
export const $chatFont = d.store(false)
export const setFontSize = d.event<number>()
export const changeFont = d.event()