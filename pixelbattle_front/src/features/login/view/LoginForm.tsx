import React from 'react'
import styled from 'styled-components'
import { useStore } from 'effector-react'

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
    Icon,
    Input,
    Link,
    Loader
} from '@/ui'

export const LoginForm = () => {
    const email = useStore($email)
    const password = useStore($password)
    const loading = useStore($loading)

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
                    <Button blockBtn type='submit'>
                        <Icon icon={'login'} />
                        Войти
                    </Button>
                    <Link onClick={() => setSettingsPage('register')}>
                        Регистрация
                    </Link>
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
