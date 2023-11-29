export interface LoginFxPayload {
    email: string;
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

export type SettingsPage = 'login' | 'register' 