import { sample } from 'effector'
import {
    $chatVisible,
    $unseenChatMessages,
    changeFont,
    closeChat,
    onNewMessage,
    openChat,
    sendMessage,
    setFontSize,
    $chatFont,
    $chatFontSize,
    toggleChat,
} from './public'
import {
    $messageText,
    setMessage,
    startSendMessage,
    $messages,
} from './private'
// import { toggleList } from '../../player-list/model';
import { logout } from '../../login/model'
import { onNewColor } from '@/features/color-picker/model'
import { MAX_MESSAGE_LENGTH } from './const'

$chatVisible
    .on(toggleChat, (s) => !s)
    .on(openChat, () => true)
    .reset([
        // toggleList,
        logout,
        closeChat
    ])

$chatFont
    .on(changeFont, (s) => !s)

$chatFontSize
    .on(setFontSize, (_, s) => {
        if (s <= 0) {
            return 16
        }
        return s
    })

$unseenChatMessages
    .on(sample({
        clock: onNewMessage,
        source: $chatVisible,
        filter: (p, k) => !p && !k.isMine
    }), (p) => p + 1)
    .reset([
        openChat,
        // toggleList,
        logout
    ])

$messages
    .on(sendMessage, (s, p) => ([...s, {
        isMine: true,
        text: p,
        username: '',
        color: '',
    }]))
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


$messageText
    .on(setMessage, (_, s) => {
        if (s.length > MAX_MESSAGE_LENGTH) {
            return s.slice(0, MAX_MESSAGE_LENGTH)
        }
        return s
    })
    .reset(sendMessage)


sample({
    clock: startSendMessage,
    source: $messageText,
    filter: (msg) => msg.trim().length >= 1,
    target: sendMessage
})
