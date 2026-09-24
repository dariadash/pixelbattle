import { sample } from 'effector'

import i18n from '@/shared/lib/i18n'
import { socket } from '@/shared/api/socket'
import { $userData, logout } from '@/features/auth/model'
import { onNewColor } from '@/features/color-picker/model'
import { toggleList } from '@/features/player-list/model'
import { openToast } from '@/features/toasts/model'

import {
    $chatVisible,
    $unseenChatMessages,
    $chatSettingsVisible,
    onNewMessage,
    sendMessage,
    toggleChat,
    toggleSettingsChat,
    $messages,
    $chatFontSize,
    $chatFont,
    setFontSize,
    changeFont
} from './public'
import {
    $messageText,
    setMessage,
    startSendMessage,
    $lastSentAt,
} from './private'
import { CHAT_COOLDOWN_MS, MAX_MESSAGE_LENGTH } from './const'

$chatVisible
    .on(toggleChat, (s) => !s)
    .reset([toggleList, logout])

$chatSettingsVisible
    .on(toggleSettingsChat, (s) => !s)
    .reset(logout)

$chatFont.on(changeFont, (s) => !s)

$chatFontSize.on(setFontSize, (_, s) => s <= 0 ? 16 : s)

$unseenChatMessages
    .on(sample({
        clock: onNewMessage,
        source: $chatVisible,
        filter: (p, k) => !p && !k.isMine
    }), (p) => p + 1)
    .reset([toggleChat, logout])

$messages
    .on(onNewMessage, (s, v) => ([...s, v]))
    .on(onNewColor, (s, a) => s.map((item) => {
        if (item.socketId === a.socketId) {
            return {
                ...item,
                color: a.color
            }
        }
        return { ...item }
    }))
    .reset(logout)

$messageText
    .on(setMessage, (_, s) => {
        if (s.length > MAX_MESSAGE_LENGTH) {
            return s.slice(0, MAX_MESSAGE_LENGTH)
        }
        return s
    })
    .reset([sendMessage, toggleChat, logout])


sample({
    clock: startSendMessage,
    source: { msg: $messageText, user: $userData, lastSent: $lastSentAt },
    filter: ({ msg, lastSent }) => msg.trim().length >= 1 && Date.now() - lastSent >= CHAT_COOLDOWN_MS,
    fn: ({ msg, user }) => ({ userId: user.id, text: msg.trim().slice(0, MAX_MESSAGE_LENGTH) }),
    target: sendMessage
})

sample({
    clock: startSendMessage,
    source: { msg: $messageText, lastSent: $lastSentAt },
    filter: ({ msg, lastSent }) => msg.trim().length >= 1 && Date.now() - lastSent < CHAT_COOLDOWN_MS,
    fn: () => ({ message: i18n.t('chat.slowDown'), options: { type: 'error' as const } }),
    target: openToast,
})

$lastSentAt
    .on(sendMessage, () => Date.now())
    .reset(logout)

sendMessage.watch(({ userId, text }) => {
    socket.emit('sendMessage', { userId, text })
})

socket.on('userMessage', (data) => onNewMessage({ ...data, isMine: data.socketId === socket.id }))