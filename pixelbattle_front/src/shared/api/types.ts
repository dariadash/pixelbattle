export type User = {
    id: number;
    email: string;
    isActivated: boolean
}

export type AuthResponse = {
    access_token: string;
    refresh_token: string;
    user: User
}