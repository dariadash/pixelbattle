export interface LoginFxPayload {
    username: string;
    password: string
}

export interface RegisterFxPayload {
    username: string;
    email: string;
    password: string
}

export interface SaveTokenFxPayload {
    access_token: string;
    refresh_token?: string
}

export type AuthPage = 'login' | 'register' 