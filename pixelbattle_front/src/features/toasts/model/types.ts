import { TypeOptions } from 'react-toastify'

export type ToastPayload = {
    message: string,
    options: {
        type: TypeOptions
    }
}

export type ToastFxPayload = {
    messages: string[],
    type: TypeOptions
}