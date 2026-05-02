import api from './api'

const QUEUE_KEY = 'eduapp_telemetry_queue'

function enqueue(event) {
 try {
 const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
 q.push(event)
 localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
 } catch {}
}

async function flush() {
 try {
 const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
 if (!q.length) return
 for (const event of q) {
 await api.post('/telemetry/cardEvent', event)
 }
 localStorage.removeItem(QUEUE_KEY)
 } catch {}
}

export async function logCardEvent(cardId, userId, eventType, eventData = {}) {
 const event = { cardId, userId, eventType, eventData, timestamp: new Date().toISOString() }
 try {
 await api.post('/telemetry/cardEvent', event)
 } catch {
 enqueue(event)
 }
}

// Flush queued events when online
window.addEventListener('online', flush)
flush()
