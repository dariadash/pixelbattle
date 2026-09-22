import React from 'react'
import { useUnit } from 'effector-react'
import { useTranslation } from 'react-i18next'

import {
    $password,
    $username,
    login,
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

export const LoginForm = () => {
    const { t } = useTranslation()
    const [username, password] = useUnit([$username, $password])

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault()
        login()
    }, [])

    return (
        <Form onSubmit={handleSubmit}>
            <h2>{t('auth.welcome')}</h2>
            <Input
                value={username}
                placeholder={t('auth.usernamePh')}
                onChange={(text) => setUsername(text)}
            />
            <Input
                value={password}
                type='password'
                placeholder={t('auth.passwordPh')}
                onChange={(text) => setPassword(text)}
            />
            <ButtonsWrapper>
                <Button type='submit'>
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
