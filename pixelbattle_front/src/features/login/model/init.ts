import { sample } from 'effector'
import { Axios, refreshSession } from '@/lib/axios'
import {
    $username,
    setUsername,
    $password,
    setPassword,
    $websocketPending,
    loadTokenFx,
    loginFx,
    refreshSessionFx,
    removeTokenFx,
    saveTokenFx,
    login,
    $email,
    setEmail,
    registerFx,
    register,
    $settingsPage,
    setSettingsPage
} from './private'
import {
    $authChecked,
    $isAuthorized,
    $userData,
    getProfileFx,
    initApp,
    logout,
    logoutFx,
    onSuccessConnect,
    sessionExpired,
    setUserData,
    setWebsocketPending
} from './public'
import { AUTH_TOKEN, REFRESH_TOKEN } from './consts'
import { openToast, openToastsFx } from '@/features/toasts/model/public'

$username
    .on(setUsername, (_, s) => s)
    .reset(initApp)

$email
    .on(setEmail, (_, s) => s)
    .reset(initApp)

$password
    .on(setPassword, (_, s) => s)
    .reset(initApp)

$isAuthorized
    .on(loginFx.done, () => true)
    .on(registerFx.done, () => true)
    .on(refreshSessionFx.done, () => true)
    .reset(logout)

$authChecked
    .on([refreshSessionFx.done, refreshSessionFx.fail], () => true)
    .reset(initApp)

$websocketPending
    .on(setWebsocketPending, (_, s) => s)
    .reset([logout, onSuccessConnect])

$settingsPage
    .on(setSettingsPage, (_, s) => s)
    .on(logoutFx.done, () => 'login')

$userData
    .on(setUserData, (_, s) => s)
    .reset(logout)

sample({
    clock: login,
    source: {
        username: $username,
        password: $password
    },
    target: loginFx
})

loginFx.use(async ({ username, password }) => {
    const { data } = await Axios.post('/login', { username, password })
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user
    }
})

sample({
    clock: register,
    source: {
        username: $username,
        email: $email,
        password: $password
    },
    target: registerFx
})

registerFx.use(async ({ username, email, password }) => {
    const { data } = await Axios.post('/register', { username, email, password })
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user
    }
})

sample({
    clock: [loginFx.failData, registerFx.failData],
    fn: (err) => ({
        messages: err.response?.data.message,
        type: 'error' as const
    }),
    target: openToastsFx
})

sample({
    clock: loginFx.done,
    fn: () => ({ message: 'Logged in', options: { type: 'success' as const } }),
    target: openToast,
})

saveTokenFx.use((t) => {
    localStorage.setItem(AUTH_TOKEN, t.access_token)
    if (t.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN, t.refresh_token)
    }
})

loadTokenFx.use(() => {
    const token = localStorage.getItem(AUTH_TOKEN)
    if (!token) {
        throw new Error('Token not found')
    }
    return token
})

removeTokenFx.use(() => {
    localStorage.removeItem(AUTH_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
})

refreshSessionFx.use(() => refreshSession())

sample({
    clock: initApp,
    target: refreshSessionFx,
})

sample({
    clock: [loginFx.doneData, registerFx.doneData, refreshSessionFx.doneData],
    fn: (data) => ({ access_token: data.access_token, refresh_token: data.refresh_token }),
    target: saveTokenFx
})

sample({
    clock: [loginFx.doneData, registerFx.doneData, refreshSessionFx.doneData],
    fn: (data) => data.user,
    target: setUserData
})

logoutFx.use(() => {
    return Axios.post('/logout')
})

sample({
    clock: sessionExpired,
    target: logout,
})

sample({
    clock: logout,
    fn: () => ({ message: 'Logged out', options: { type: 'success' as const } }),
    target: [openToast, removeTokenFx, logoutFx]
})

// getProfileFx.use(() => Axios.get('/', { params: { username: $username } }))
