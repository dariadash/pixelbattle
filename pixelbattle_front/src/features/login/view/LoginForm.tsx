import React from 'react'
import { useUnit } from 'effector-react'

import {
    $loading,
    $password,
    $email,
    login,
    setPassword,
    setSettingsPage,
    setEmail
} from '../model/private'
import {
    Button,
    ButtonsWrapper,
    Form,
    Icon,
    Input,
    Link,
    Loader
} from '@/ui'

export const LoginForm = () => {
    const [email, password, loading] = useUnit([$email, $password, $loading])

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault()
        login()
    }, [])

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Добро пожаловать</h2>
            <Input
                value={email}
                placeholder={'Email'}
                onChange={(text) => setEmail(text)}
            />
            <Input
                value={password}
                type='password'
                placeholder={'Пароль'}
                onChange={(text) => setPassword(text)}
            />
            {loading && <Loader />}
            {!loading && (
                <ButtonsWrapper>
                    <Button type='submit'>
                        <Icon icon={'login'} />
                        Войти
                    </Button>
                    <Link $color="actionPrimary" $hoverColor="actionPrimaryHover" onClick={() => setSettingsPage('register')}>
                        Регистрация
                    </Link>
                </ButtonsWrapper>
            )}
        </Form>
    )
}
