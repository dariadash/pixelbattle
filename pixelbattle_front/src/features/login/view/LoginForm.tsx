import React from 'react'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'

import {
    login,
    setPassword,
    setSettingsPage,
    setUsername
} from '../model/private'
import { $loading } from '../model/public'
import {
    Button,
    ButtonsWrapper,
    Form,
    Icon,
    Input,
    Link
} from '@/ui'

type LoginValues = {
    username: string,
    password: string,
}

export const LoginForm = () => {
    const { t } = useTranslation()
    const loading = useUnit($loading)
    const { control, handleSubmit, formState: { errors } } = useForm<LoginValues>({
        defaultValues: { username: '', password: '' },
    })

    const onSubmit = (data: LoginValues) => {
        setUsername(data.username)
        setPassword(data.password)
        login()
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h2>{t('auth.welcome')}</h2>
            <Controller
                name='username'
                control={control}
                rules={{ required: t('validation.required') }}
                render={({ field }) => (
                    <Input
                        value={field.value}
                        placeholder={t('auth.usernamePh')}
                        onChange={(text) => field.onChange(text)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        hasError={!!errors.username}
                        errorText={errors.username?.message}
                    />
                )}
            />
            <Controller
                name='password'
                control={control}
                rules={{
                    required: t('validation.required'),
                    minLength: { value: 6, message: t('validation.minLength', { min: 6 }) },
                }}
                render={({ field }) => (
                    <Input
                        value={field.value}
                        type='password'
                        placeholder={t('auth.passwordPh')}
                        onChange={(text) => field.onChange(text)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        hasError={!!errors.password}
                        errorText={errors.password?.message}
                    />
                )}
            />
            <ButtonsWrapper>
                <Button type='submit' disabled={loading}>
                    <Icon icon={'login'} />
                    {t('auth.login')}
                </Button>
                <Link $color="actionPrimary" $hoverColor="actionPrimaryHover" onClick={() => setSettingsPage('register')}>
                    {t('auth.goRegister')}
                </Link>
            </ButtonsWrapper>
        </Form>
    )
}
