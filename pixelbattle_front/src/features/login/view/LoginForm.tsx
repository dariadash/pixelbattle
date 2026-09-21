import React from 'react'
import { useUnit } from 'effector-react'

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
    const [username, password] = useUnit([$username, $password])

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault()
        login()
    }, [])

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Добро пожаловать</h2>
            <Input
                value={username}
                placeholder={'Имя пользователя'}
                onChange={(text) => setUsername(text)}
            />
            <Input
                value={password}
                type='password'
                placeholder={'Пароль'}
                onChange={(text) => setPassword(text)}
            />
            <ButtonsWrapper>
                <Button type='submit'>
                    <Icon icon={'login'} />
                    Войти
                </Button>
                <Link $color="actionPrimary" $hoverColor="actionPrimaryHover" onClick={() => setSettingsPage('register')}>
                    Регистрация
                </Link>
            </ButtonsWrapper>
        </Form>
    )
}
