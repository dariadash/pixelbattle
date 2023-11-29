import { createDomain } from 'effector'
import { Message } from './types'

const d = createDomain()

export const $chatVisible = d.store(false)

export const $unseenChatMessages = d.store(0)

export const sendMessage = d.event<string>()
export const onNewMessage = d.event<Message>()

export const toggleChat = d.event()
export const openChat = d.event()
export const closeChat = d.event()


export const setFontSize = d.event<number>()
export const changeFont = d.event()
export const $chatFontSize = d.store<number>(14)
export const $chatFont = d.store(false)
