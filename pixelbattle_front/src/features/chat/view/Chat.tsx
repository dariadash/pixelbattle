import React from 'react'
import { useStore } from 'effector-react'
import styled, { css } from 'styled-components'

import { $chatFontSize, $chatFont, $chatVisible, closeChat, toggleChat } from '../model'
import { $messages, } from '../model/private'
import { ChatForm } from './ChatForm'
import { Icon, Button } from '@/ui'

const AUTOSCROLL_THRESHOLD_PX = 350

export const Chat = () => {
    const messagesContainer = React.useRef<HTMLDivElement>(null)
    const messages = useStore($messages)
    const chatVisible = useStore($chatVisible)
    const fontSize = useStore($chatFontSize)
    const chatFont = useStore($chatFont)

    React.useEffect(() => {
        if (messagesContainer.current) {
            const currentScrollPosition = messagesContainer.current.scrollTop
            const windowHeight = messagesContainer.current.clientHeight
            const scrollBottom = currentScrollPosition + windowHeight

            const containerHeight = messagesContainer.current.scrollHeight

            const totalMessages = messagesContainer.current.children.length
            if (totalMessages === 0) {
                return
            }
            const lastChildHeight = messagesContainer.current.children[totalMessages - 1].clientHeight
            if (
                containerHeight - (scrollBottom + lastChildHeight) < AUTOSCROLL_THRESHOLD_PX
            ) {
                messagesContainer.current.scrollTo(0, containerHeight)
            }
        }
    }, [messages])

    React.useEffect(() => {
        if (chatVisible) {
            if (messagesContainer.current) {
                messagesContainer.current.style.scrollBehavior = 'auto'
                messagesContainer.current.scrollTo(0, messagesContainer.current.scrollHeight)
                messagesContainer.current.style.scrollBehavior = 'auto'
            }
        }
    }, [chatVisible])

    if (!chatVisible) {
        return null
    }

    return (
        <Container>
            <ChatWrapper>
                <ButtonWrapper>
                    <Button onClick={toggleChat} size='small'>
                        <Icon icon="close" />
                    </Button>
                </ButtonWrapper>
                <MessagesWrapper>
                    <Messages ref={messagesContainer}>
                        {messages.map(({ isMine, text, username, color }, index) => (
                            <div key={index}>
                                {
                                    isMine
                                        ? <MessageFromMe size={fontSize} font={chatFont}>
                                            {text}
                                        </MessageFromMe>
                                        : <MessageFromThem size={fontSize} font={chatFont}>
                                            <Username color={color}>
                                                {username}
                                            </Username>
                                            {text}
                                        </MessageFromThem>
                                }
                            </div>
                        ))}
                    </Messages>
                    <ChatForm />
                </MessagesWrapper>
            </ChatWrapper>
        </Container>
    )
}

type StyledProps = {
    color?: string,
    size?: number,
    font?: boolean,
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    position: fixed;
    left: 16px;
    bottom: 16px;
    top: 16px;
    gap: 20px;
    z-index: 100;
`

const ChatWrapper = styled.div`
    width: 360px;
    max-width: 100%;
    background-color: #00000050;
    backdrop-filter: blur(12px);
    color: #fff;
    padding: 16px;
    border-radius: 18px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`

const MessagesWrapper = styled.div`
`

const Messages = styled.div`
    ::-webkit-scrollbar {
        width: 20px;
    }

    ::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 14px 14px #bbbbbe;
        border: solid 6px transparent;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        border: solid 6px transparent;
        box-shadow: inset 0 0 14px 14px #555;
    }
    overflow-y: auto;
    position: absolute;
    top: 60px;
    bottom: 80px;
    left: 16px;
    right: 16px;

  scroll-behavior: smooth;
`

const MessageFromMe = styled.p<StyledProps>`
    font-size: 14px;
    border-radius: 1.15rem;
    line-height: 1.25;
    padding: 0.5rem .875rem;
    position: relative;
    word-wrap: break-word;
    max-width: 340px;

    align-self: flex-end;
    background-color: #248bf5;
    color: #fff;
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 94%;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-top-color: #248bf5;
        border-bottom: 0;
        border-right: 0;
        margin-left: -5px;
        margin-bottom: -10px;
    }
    ${({ color }) => color && css`
        color: ${color};
    `}
    ${({ size }) => size && css`
        font-size: ${size}px;
    `}
    ${({ font }) => font && css`
        font-family: 'Pixelcyr';
        font-weight: 400;
    `}
`

const MessageFromThem = styled.p<StyledProps>` 
    font-size: 14px;
    border-radius: 1.15rem;
    line-height: 1.25;
    padding: 0.5rem .875rem;
    position: relative;
    word-wrap: break-word;

    max-width: 340px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #e5e5ea;
    color: #000;
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 6%;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-top-color: #e5e5ea;
        border-bottom: 0;
        border-left: 0;
        margin-left: -5px;
        margin-bottom: -10px;
    }
    ${({ size }) => size && css`
        font-size: ${size}px;
    `}
    ${({ font }) => font && css`
        font-family: 'Pixelcyr';
        font-weight: 400;
    `}
`

const Username = styled.strong<StyledProps>`
    ${({ color }) => color && css`
        color: ${color};
    `}
`
