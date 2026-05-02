import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import { logCardEvent } from '../../services/telemetry'
import { detectDeviceProfile } from '../../utils/deviceProfile'
import Spinner from '../../components/common/Spinner'

export default function StudentPractice() {
 const { cardId } = useParams()
 const userId = useAuthStore(s => s.userId)
 const [card, setCard] = useState(null)
 const [loading, setLoading] = useState(true)
 const [answers, setAnswers] = useState({})
 const [submitted, setSubmitted] = useState(false)
 const [score, setScore] = useState(null)

 const variant = detectDeviceProfile().variant

 useEffect(() => {
 api.get(`/cards/${cardId}?variant=${variant}`)
 .then(r => { setCard(r.data); logCardEvent(cardId, userId, 'card_view') })
 .finally(() => setLoading(false))
 }, [cardId])

 async function submit() {
 const answersArr = Object.entries(answers).map(([i, selected]) => ({ itemId: i, selected }))
 const { data } = await api.post(`/quizzes/${cardId}/submit`, { answers: answersArr })
 setScore(data)
 setSubmitted(true)
 logCardEvent(cardId, userId, 'quiz_result', data)
 }

 if (loading) return <Spinner />
 if (!card) return <p className="text-center mt-8 text-gray-500">Card not found.</p>

 const items = typeof card.check_items === 'string' ? JSON.parse(card.check_items) : (card.check_items || [])

 return (
 <div className="max-w-lg mx-auto">
 <div className="card mb-4">
 <p className="text-xs font-medium text-brand-600 uppercase mb-1">{card.subject} Grade {card.grade}</p>
 <h2 className="text-xl font-bold mb-2">{card.title}</h2>
 <p className="text-sm text-gray-600 mb-3"><strong>Objective:</strong> {card.objective}</p>
 <p className="bg-blue-50 rounded-lg p-3 text-sm mb-3">{card.model_text}</p>
 {card.assetUrl && <audio controls src={card.assetUrl} className="w-full mb-2" />}
 </div>

 {!submitted ? (
 <div className="card">
 <h3 className="font-semibold mb-3">Quick Check</h3>
 {items.map((item, i) => (
 <div key={i} className="mb-3">
 <p className="text-sm font-medium mb-1">{item.question || item}</p>
 {item.options?.map(opt => (
 <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer mb-1">
 <input type="radio" name={`q${i}`} value={opt} onChange={() => setAnswers(a => ({ ...a, [i]: opt }))} />
 {opt}
 </label>
 ))}
 </div>
 ))}
 <button onClick={submit} className="btn-primary w-full mt-2">Submit</button>
 </div>
 ) : (
 <div className="card text-center">
 <p className="text-4xl font-bold text-brand-600">{score?.score}%</p>
 <p className="text-gray-600 mt-2">{score?.correct}/{score?.total} correct</p>
 <p className={`mt-2 font-semibold ${score?.passed ? 'text-green-600' : 'text-red-500'}`}>
 {score?.passed ? '< Mastery achieved!' : 'Keep practising!'}
 </p>
 <button onClick={() => setSubmitted(false)} className="btn-secondary mt-4">Try Again</button>
 </div>
 )}
 </div>
 )
}
