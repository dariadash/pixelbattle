import { sample } from 'effector'
import {
    $chatVisible,
    $unseenChatMessages,
    $chatSettingsVisible,
    onNewMessage,
    sendMessage,
    toggleChat,
    toggleSettingsChat,
} from './public'
import {
    $messageText,
    setMessage,
    startSendMessage,
    $lastSentAt,
    $messages,
    $chatFontSize,
    $chatFont,
    setFontSize,
    changeFont,
} from './private'
import { toggleList } from '../../player-list/model'
import { $userData, logout } from '../../login/model'
import { onNewColor } from '@/features/color-picker/model'
import { openToast } from '@/features/toasts/model/public'
import i18n from '@/lib/i18n'
import { CHAT_COOLDOWN_MS, MAX_MESSAGE_LENGTH } from './const'
import { socket } from '@/lib/socket'

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