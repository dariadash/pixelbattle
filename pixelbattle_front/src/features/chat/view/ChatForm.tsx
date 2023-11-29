import React from 'react'
import styled from 'styled-components'
import { Button, Icon } from '@/ui'
import { $messageText, setMessage, startSendMessage } from '../model/private'
import { useStore } from 'effector-react'

export const ChatForm = () => {
    const messageText = useStore($messageText)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const handleSubmit = React.useCallback((e) => {
        e.preventDefault()
        startSendMessage()
    }, [])
    React.useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <InputWrapper onSubmit={handleSubmit}>
            <ChatInput
                ref={inputRef}
                placeholder="Message"
                value={messageText}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button type='submit'>
                <Icon icon="send" />
            </Button>
        </InputWrapper>
    )
}

const InputWrapper = styled.form`    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
`

const ChatInput = styled.input`    
    padding: 12px 20px;
    border: 1px solid #111;
    border-radius: 6px;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 14px;
    flex: 1;
    background-color: #00000050;
` 
