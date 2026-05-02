import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({ baseURL: '/api' })

// Attach JWT on every request
api.interceptors.request.use(cfg => {
  const token = useAuthStore.getState().token
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Auto-logout on 401 (invalid token) or 403 (locked/suspended/banned)
api.interceptors.response.use(
  r => r,
  err => {
    const status = err.response?.status
    const message = err.response?.data?.error || ''

    if (status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }

    if (status === 403 && (
      message.includes('locked') ||
      message.includes('suspended') ||
      message.includes('not found')
    )) {
      useAuthStore.getState().logout()
      window.location.href = '/login?reason=' + encodeURIComponent(message)
    }

    return Promise.reject(err)
  }
)

export default api
