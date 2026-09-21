import React from 'react'
import styled from 'styled-components'
import { Button, Icon, Input } from '@/ui'
import { $messageText, setMessage, startSendMessage } from '../model/private'
import { useUnit } from 'effector-react'

export const ChatForm = () => {
    const messageText = useUnit($messageText)
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
            <Input
                ref={inputRef}
                placeholder="Message"
                value={messageText}
                onChange={(text) => setMessage(text)}
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
