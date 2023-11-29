import { forward, sample } from 'effector'
import { Axios } from '@/lib/axios'
import {
    $username,
    setUsername,
    $password,
    setPassword,
    $websocketPending,
    loadTokenFx,
    loginFx,
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
    $isAuthorized,
    $userData,
    getProfileFx,
    initApp,
    logout,
    logoutFx,
    onSuccessConnect,
    setUserData,
    setWebsocketPending
} from './public'
import { AUTH_TOKEN } from './consts'
import { openToast, openToastsFx } from '@/features/toasts/model/public'

$username
    .on(setUsername, (_, s) => s)

$email
    .on(setEmail, (_, s) => s)

$password
    .on(setPassword, (_, s) => s)

$isAuthorized
    .on(loginFx.done, () => true)
    // .on(getProfileFx.done, () => true)
    .on(registerFx.done, () => true)
    .reset(logout)

$websocketPending
    .on(setWebsocketPending, (_, s) => s)
    .reset([logout, onSuccessConnect])

sample({
    clock: login,
    source: {
        email: $email,
        password: $password
    },
    target: loginFx
})

loginFx.use(async ({ email, password }) => {
    const { data } = await Axios.post('/login', { email, password })
    console.log(data)
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

registerFx.use(({ username, email, password }) => {
    return Axios.post('/register', { username, email, password })
})

sample({
    clock: [loginFx.failData, registerFx.failData],
    fn: (err) => (
        {
            messages: err.response?.data.message,
            type: 'error' as const
        }
    ),
    target: openToastsFx
})

sample({
    clock: loginFx.done,
    fn: () => ({ message: 'Logged in', options: { type: 'success' as const } }),
    target: openToast,
})

saveTokenFx.use((t) => {
    console.log(t, '!!!!!!')
    localStorage.setItem('token', t)
    return t
})

loadTokenFx.use(() => {
    const token = localStorage.getItem(AUTH_TOKEN)
    if (!token) {
        throw new Error('Token not found')
    }
    return token
})

removeTokenFx.use(() => {
    localStorage.removeItem('token')
})

logoutFx.use(() => {
    return Axios.post('/logout')
})

sample({
    clock: initApp,
    target: loadTokenFx,
})

sample({
    clock: loginFx.doneData,
    fn: (data) => data.access_token,
    target: [saveTokenFx]
})

$userData
    .on(setUserData, (_, s) => s)

sample({
    clock: loginFx.doneData,
    fn: (data) => data.user,
    target: setUserData
})

sample({
    clock: logout,
    fn: () => ({ message: 'Logged out', options: { type: 'success' as const } }),
    target: [openToast, removeTokenFx, logoutFx]
})

getProfileFx.use(() => Axios.get('/', { params: { username: $username } }))

$settingsPage
    .on(setSettingsPage, (_, s) => s)
    // .on(loginFx.done, () => 'login')
    // .on(registerFx.done, () => 'login')
    .on(removeTokenFx.done, () => 'login')

