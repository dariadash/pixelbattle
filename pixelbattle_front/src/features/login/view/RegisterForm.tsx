import React from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'

import {
    register,
    setEmail,
    setPassword,
    setSettingsPage,
    setUsername
} from '../model/private'
import {
    Button,
    ButtonsWrapper,
    Form,
    Icon,
    Input,
    Link
} from '@/ui'
import { EMAIL_RE } from '@/lib/validation'

type RegisterValues = {
    username: string,
    email: string,
    password: string,
}

export const RegisterForm = () => {
    const { t } = useTranslation()
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
        defaultValues: { username: '', email: '', password: '' },
    })

    const onSubmit = (data: RegisterValues) => {
        setUsername(data.username)
        setEmail(data.email)
        setPassword(data.password)
        register()
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h2>{t('auth.registerTitle')}</h2>
            <Controller
                name='username'
                control={control}
                rules={{ required: t('validation.required') }}
                render={({ field }) => (
                    <Input
                        value={field.value}
                        placeholder={t('auth.namePh')}
                        onChange={(text) => field.onChange(text)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        hasError={!!errors.username}
                        errorText={errors.username?.message}
                    />
                )}
            />
            <Controller
                name='email'
                control={control}
                rules={{
                    required: t('validation.required'),
                    pattern: { value: EMAIL_RE, message: t('validation.email') },
                }}
                render={({ field }) => (
                    <Input
                        value={field.value}
                        placeholder={t('auth.emailPh')}
                        onChange={(text) => field.onChange(text)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        hasError={!!errors.email}
                        errorText={errors.email?.message}
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
                <Link $color="actionPrimary" $hoverColor="actionPrimaryHover" onClick={() => setSettingsPage('login')}>
                    {t('auth.goLogin')}
                </Link>
                <Button type='submit'>
                    <Icon icon={'login'} />
                    {t('auth.doRegister')}
                </Button>
            </ButtonsWrapper>
        </Form>
    )
}
