import React from 'react'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'

import {
    $email,
    $password,
    $username,
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

export const RegisterForm = () => {
    const { t } = useTranslation()
    const [username, email, password] = useUnit([$username, $email, $password])

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault()
        register()
    }, [])

    return (
        <Form onSubmit={handleSubmit}>
            <h2>{t('auth.registerTitle')}</h2>
            <Input
                value={username}
                placeholder={t('auth.namePh')}
                onChange={(text) => setUsername(text)}
                required
            />
            <Input
                value={email}
                placeholder={t('auth.emailPh')}
                onChange={(text) => setEmail(text)}
                required
            />
            <Input
                value={password}
                type='password'
                placeholder={t('auth.passwordPh')}
                onChange={(text) => setPassword(text)}
                required
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
