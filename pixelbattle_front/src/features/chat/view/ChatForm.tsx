import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'
import { Button, Icon, Input } from '@/ui'
import { setMessage, startSendMessage } from '../model/private'
import { MAX_MESSAGE_LENGTH } from '../model/const'

type ChatValues = {
    message: string,
}

export const ChatForm = () => {
    const { t } = useTranslation()
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const { control, handleSubmit, reset } = useForm<ChatValues>({
        defaultValues: { message: '' },
    })

    React.useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const onSubmit = (data: ChatValues) => {
        setMessage(data.message)
        startSendMessage()
        reset()
    }

    return (
        <InputWrapper onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name='message'
                control={control}
                rules={{
                    required: true,
                    validate: (v) => v.trim().length >= 1,
                    maxLength: MAX_MESSAGE_LENGTH,
                }}
                render={({ field }) => (
                    <Input
                        ref={(el) => {
                            field.ref(el)
                            inputRef.current = el
                        }}
                        placeholder={t('chat.messagePh')}
                        value={field.value}
                        onChange={(text) => field.onChange(text.slice(0, MAX_MESSAGE_LENGTH))}
                    />
                )}
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
