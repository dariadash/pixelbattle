export interface LoginFxPayload {
    username: string;
    password: string
}

export interface User {
    id: number;
    email: string;
    isActivated: boolean
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User
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

export type SettingsPage = 'login' | 'register' 