import React from 'react'
import { useUnit } from 'effector-react'

import {
    $email,
    $loading,
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
    Loader,
    Link
} from '@/ui'

export const RegisterForm = () => {
    const [username, email, password, loading] = useUnit([$username, $email, $password, $loading])

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault()
        register()
    }, [])

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Регистрация</h2>
            <Input
                value={username}
                placeholder={'Имя'}
                onChange={(text) => setUsername(text)}
                required
            />
            <Input
                value={email}
                placeholder={'Email'}
                onChange={(text) => setEmail(text)}
                required
            />
            <Input
                value={password}
                type='password'
                placeholder={'Пароль'}
                onChange={(text) => setPassword(text)}
                required
            />
            {loading && <Loader />}
            {!loading && (
                <ButtonsWrapper>
                    <Link $color="actionPrimary" $hoverColor="actionPrimaryHover" onClick={() => setSettingsPage('login')}>
                        Войти через логин/пароль
                    </Link>
                    <Button type='submit'>
                        <Icon icon={'login'} />
                        Зарегистрироваться
                    </Button>
                </ButtonsWrapper>
            )}
        </Form>
    )
}
