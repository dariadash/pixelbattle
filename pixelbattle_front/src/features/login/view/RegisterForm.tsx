import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'

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
    Icon,
    Input,
    Loader,
    Link
} from '@/ui'

export const RegisterForm = () => {
    const username = useStore($username)
    const email = useStore($email)
    const password = useStore($password)
    const loading = useStore($loading)

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
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                value={email}
                placeholder={'Email'}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                value={password}
                type='password'
                placeholder={'Пароль'}
                onChange={(e) => setPassword(e.target.value)}
            />
            {loading && <Loader />}
            {!loading && (
                <ButtonWrapper>
                    <Link onClick={() => setSettingsPage('login')}>
                        Войти через логин/пароль
                    </Link>
                    <Button blockBtn type='submit'>
                        <Icon icon={'login'} />
                        Зарегистрироваться
                    </Button>
                </ButtonWrapper>
            )}
        </Form>
    )
}

const Form = styled.form`
    display: flex;
    flex-flow: column;
    justify-content: center;
    gap: 24px;
    color: #fff;
    max-width: 360px;
    width: 100%;
    padding: 20px;

    background-color: #00000050;
    backdrop-filter: blur(12px);
`

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
