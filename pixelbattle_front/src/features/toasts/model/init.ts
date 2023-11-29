import { toast } from 'react-toastify'
import { openToast, openToastsFx } from './public'

openToast.watch((payload) => {
    toast(payload.message, { type: payload.options.type })
})

openToastsFx.use((p) => {
    for (const it of p.messages) {
        openToast({ message: it, options: { type: p.type } })
    }
})