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
    $messages,
    $chatFontSize,
    $chatFont,
    setFontSize,
    changeFont,
} from './private'
import { toggleList } from '../../player-list/model'
import { $userData, logout } from '../../login/model'
import { onNewColor } from '@/features/color-picker/model'
import { MAX_MESSAGE_LENGTH } from './const'
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
    source: { msg: $messageText, user: $userData },
    filter: ({ msg }) => msg.trim().length >= 1,
    fn: ({ msg, user }) => ({ userId: user.id, text: msg }),
    target: sendMessage
})

sendMessage.watch(({ userId, text }) => {
    socket.emit('sendMessage', { userId, text })
})

socket.on('userMessage', (data) => onNewMessage({ ...data, isMine: data.socketId === socket.id }))