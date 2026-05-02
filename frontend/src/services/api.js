import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({ baseURL: '/api' })

// Attach JWT on every request
api.interceptors.request.use(cfg => {
 const token = useAuthStore.getState().token
 if (token) cfg.headers.Authorization = `Bearer ${token}`
 return cfg
})

// Response interceptor
api.interceptors.response.use(
 r => r,
 err => {
 const status = err.response?.status
 const message = err.response?.data?.error || ''

 // -- Permanently deleted / terminated ----------------------
 if (status === 403 && message === 'ACCOUNT_TERMINATED') {
 localStorage.setItem('account_terminated', 'true')
 useAuthStore.getState().logout()
 window.dispatchEvent(new CustomEvent('app:redirect', { detail: { path: '/terminated' } }))
 return Promise.reject(err)
 }

 // -- Invalid / expired token -> logout ----------------------
 if (status === 401) {
 useAuthStore.getState().clearMaintenance()
 useAuthStore.getState().logout()
 }

 // -- Locked / suspended -> maintenance screen ---------------
 if (status === 403 && (
 message.includes('locked') ||
 message.includes('suspended') ||
 message.includes('not found')
 )) {
 useAuthStore.getState().setMaintenance(message)
 useAuthStore.getState().logout()
 }

 return Promise.reject(err)
 }
)

export default api
