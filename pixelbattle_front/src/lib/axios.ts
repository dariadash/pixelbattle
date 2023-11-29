import axios from 'axios'

export const Axios = axios.create({
    baseURL: '/api',
    responseType: 'json',
    withCredentials: true
})

Axios.interceptors.request.use((config) => {
    const bearerToken = localStorage.getItem('access_token')
    if (bearerToken && config.headers) {
        config.headers.Authorization = `Bearer ${bearerToken}`
    }
    return config
})

Axios.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    if (error.responce.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const responce = await axios.get(
                'http://localhost:3000/api/refresh',
                { withCredentials: true }
            )
            localStorage.setItem('token', responce.data.access_token)
            return axios.request(originalRequest)
        } catch (e) {
            console.log(e, 'Not authorized')
        }
    }
    throw error
})



export async function checkAuth() {
    try {
        const responce = await axios.get(
            'http://localhost:3000/api/refresh',
            { withCredentials: true }
        )
        console.log(responce)
        localStorage.setItem('token', responce.data.access_token)

    } catch (e: any) {
        console.log(e.responce?.data?.message)
    }
}