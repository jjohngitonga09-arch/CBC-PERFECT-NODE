const fs = require('fs')
const path = require('path')

// ─── STORIES.JSX ────────────────────────────────────────────────────────────
const storiesContent = `import { useState } from 'react'
import PREMADE_STORIES from './storiesData'

const bg = '#0a0e17'

const GENRES = [
  { id: 'adventure', label: 'Adventure',         emoji: '🧭', desc: 'Exciting journeys and brave heroes',      color: '#f59e0b' },
  { id: 'fantasy',   label: 'Fantasy / Magic',   emoji: '🔮', desc: 'Magic, wizards and enchanted worlds',     color: '#8b5cf6' },
  { id: 'scifi',     label: 'Science Fiction',   emoji: '🚀', desc: 'Robots, space and future technology',     color: '#3b82f6' },
  { id: 'horror',    label: 'Horror',            emoji: '👻', desc: 'Spooky, mysterious and thrilling tales',  color: '#ef4444' },
  { id: 'humour',    label: 'Humour',            emoji: '😂', desc: 'Funny, silly and laugh-out-loud stories', color: '#10b981' },
  { id: 'realistic', label: 'Realistic Fiction', emoji: '🌍', desc: 'Everyday life and real feelings',         color: '#6366f1' },
  { id: 'survival',  label: 'Survival Story',    emoji: '🏕️', desc: 'Staying alive against all odds',          color: '#f97316' },
]

function Modal({ story, genre, onClose }) {
  const [tab,     setTab]     = useState('story')
  const [answers, setAnswers] = useState({})
  const [score,   setScore]   = useState(null)
  const [copied,  setCopied]  = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(story.title + '\\n\\n' + story.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const submitQuiz = () => {
    let correct = 0
    story.questions.forEach((q, i) => { if (answers[i] === q.answer) correct++ })
    setScore(correct)
  }

  const answeredAll = Object.keys(answers).length >= story.questions.length

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#111827', border: '1px solid #1f2937', borderRadius: '18px',
        width: '100%', maxWidth: '700px', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1f2937', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: 800, color: '#f9fafb', margin: '0 0 3px', fontSize: '1.1rem' }}>{story.title}</p>
              <p style={{ color: '#6b7280', fontSize: '.78rem', margin: 0 }}>
                <span style={{ color: genre.color, fontWeight: 700 }}>{genre.emoji} {genre.label}</span>
                &nbsp;·&nbsp;{story.questions.length} quiz questions
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={copy} style={{
                padding: '7px 14px', borderRadius: '8px', border: '1px solid #374151',
                background: copied ? 'rgba(34,197,94,0.15)' : '#0f1520',
                color: copied ? '#4ade80' : '#9ca3af', fontWeight: 600, fontSize: '.75rem', cursor: 'pointer'
              }}>{copied ? '✓ Copied!' : 'Copy'}</button>
              <button onClick={onClose} style={{
                padding: '7px 12px', borderRadius: '8px', border: '1px solid #374151',
                background: '#0f1520', color: '#9ca3af', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1
              }}>×</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            {['story', 'quiz'].map(t => (
              <button key={t} onClick={() => { setTab(t); if (t === 'story') { setAnswers({}); setScore(null) } }} style={{
                padding: '6px 16px', borderRadius: '8px', border: '1px solid',
                borderColor: tab === t ? genre.color : '#1f2937',
                background: tab === t ? genre.color + '22' : 'transparent',
                color: tab === t ? genre.color : '#6b7280',
                fontWeight: 700, fontSize: '.75rem', cursor: 'pointer'
              }}>
                {t === 'story' ? 'Full Story' : 'Quiz'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {tab === 'story' ? (
            <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: '10px', padding: '24px' }}>
              {story.body.split('\\n\\n').map((para, i) => (
                <p key={i} style={{ color: '#d1d5db', fontSize: '.88rem', lineHeight: 1.9, margin: '0 0 14px', whiteSpace: 'pre-line' }}>{para}</p>
              ))}
            </div>
          ) : score !== null ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '3.5rem', margin: '0 0 8px' }}>
                {score === story.questions.length ? '🏆' : score >= Math.ceil(story.questions.length / 2) ? '⭐' : '📚'}
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f9fafb', margin: '0 0 6px' }}>
                {score}/{story.questions.length}
              </p>
              <p style={{ color: '#6b7280', fontSize: '.875rem', margin: '0 0 24px' }}>
                {score === story.questions.length ? 'Perfect score! Outstanding!' : score >= Math.ceil(story.questions.length / 2) ? 'Good job! Keep reading!' : 'Read the story again and try once more!'}
              </p>
              <button onClick={() => { setScore(null); setAnswers({}) }} style={{
                padding: '11px 28px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg,' + genre.color + ',' + genre.color + 'aa)',
                color: '#fff', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer'
              }}>Try Again</button>
            </div>
          ) : (
            <div>
              {story.questions.map((q, i) => (
                <div key={i} style={{ marginBottom: '16px', padding: '16px', background: '#0d1117', borderRadius: '10px', border: '1px solid #1f2937' }}>
                  <p style={{ fontWeight: 700, color: '#f9fafb', margin: '0 0 12px', fontSize: '.88rem', lineHeight: 1.5 }}>
                    {i + 1}. {q.q}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {q.options.map((opt, j) => (
                      <button key={j} onClick={() => setAnswers(a => ({ ...a, [i]: j }))} style={{
                        padding: '9px 14px', borderRadius: '8px', border: '1px solid',
                        borderColor: answers[i] === j ? genre.color : '#1f2937',
                        background: answers[i] === j ? genre.color + '22' : '#111827',
                        color: answers[i] === j ? genre.color : '#9ca3af',
                        fontWeight: answers[i] === j ? 700 : 400,
                        fontSize: '.82rem', cursor: 'pointer', textAlign: 'left', transition: 'all .12s'
                      }}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitQuiz} disabled={!answeredAll} style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                background: answeredAll ? 'linear-gradient(135deg,' + genre.color + ',' + genre.color + 'bb)' : '#1f2937',
                color: answeredAll ? '#fff' : '#4b5563',
                fontWeight: 800, fontSize: '.9rem', cursor: answeredAll ? 'pointer' : 'default', marginTop: '4px'
              }}>
                {answeredAll ? 'Submit Quiz' : \`Answer all questions (\${Object.keys(answers).length}/\${story.questions.length})\`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GenreSection({ genre, onSelect }) {
  const stories = PREMADE_STORIES[genre.id] || []
  if (!stories.length) return null
  return (
    <div style={{ marginBottom: '52px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '20px', paddingBottom: '14px',
        borderBottom: \`2px solid \${genre.color}33\`
      }}>
        <span style={{ fontSize: '1.8rem' }}>{genre.emoji}</span>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 900, color: '#f9fafb', margin: 0, fontSize: '1.4rem' }}>{genre.label}</h2>
          <p style={{ color: '#6b7280', fontSize: '.78rem', margin: 0 }}>{genre.desc}</p>
        </div>
        <span style={{
          background: genre.color + '22', color: genre.color,
          fontSize: '.68rem', fontWeight: 800, padding: '3px 10px',
          borderRadius: '20px', border: \`1px solid \${genre.color}44\`
        }}>{stories.length} {stories.length === 1 ? 'story' : 'stories'}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {stories.map(s => (
          <button key={s.title} onClick={() => onSelect(s, genre)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = genre.color; e.currentTarget.style.background = genre.color + '11' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.background = '#0d1117' }}
            style={{
              background: '#0d1117', border: '1px solid #1f2937', borderRadius: '12px',
              padding: '16px', cursor: 'pointer', textAlign: 'left',
              transition: 'border-color .15s, background .15s', width: '100%'
            }}>
            <p style={{ fontWeight: 700, color: '#f9fafb', fontSize: '.9rem', margin: '0 0 6px', lineHeight: 1.4 }}>{s.title}</p>
            <p style={{ color: '#6b7280', fontSize: '.72rem', margin: 0 }}>{s.questions.length} quiz questions</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Stories() {
  const [modal, setModal] = useState(null)
  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '28px 24px' }}>
      {modal && <Modal story={modal.story} genre={modal.genre} onClose={() => setModal(null)} />}
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f9fafb', margin: '0 0 8px' }}>📖 Stories</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '.88rem' }}>
            Click any story to read in full — then test yourself with a quiz
          </p>
        </div>
        {GENRES.map(genre => (
          <GenreSection key={genre.id} genre={genre} onSelect={(s, g) => setModal({ story: s, genre: g })} />
        ))}
      </div>
    </div>
  )
}
`

// ─── WORLDEXPLORER.JSX ──────────────────────────────────────────────────────
const worldContent = `import { useState } from 'react'

const bg = '#0a0e17'

const CONTINENTS = [
  {
    id: 'africa', name: 'Africa', emoji: '🌍', color: '#f59e0b',
    desc: "The second largest continent, home to 54 countries and the world's longest river.",
    countries: [
      { name: 'Kenya',        capital: 'Nairobi',      pop: '55M',   area: '580,367 km²', lang: 'Swahili, English', fact: 'Home of the Great Rift Valley and the Maasai Mara wildlife reserve.' },
      { name: 'Egypt',        capital: 'Cairo',        pop: '105M',  area: '1,001,450 km²', lang: 'Arabic', fact: 'The ancient Egyptians built the pyramids over 4,500 years ago.' },
      { name: 'Nigeria',      capital: 'Abuja',        pop: '220M',  area: '923,768 km²', lang: 'English + 500 local', fact: 'The most populous country in Africa with over 500 ethnic groups.' },
      { name: 'South Africa', capital: 'Pretoria',     pop: '60M',   area: '1,219,090 km²', lang: '11 official languages', fact: 'Has three capital cities and 11 official languages.' },
      { name: 'Ethiopia',     capital: 'Addis Ababa',  pop: '120M',  area: '1,104,300 km²', lang: 'Amharic', fact: 'One of the oldest nations in the world, never colonised.' },
      { name: 'Tanzania',     capital: 'Dodoma',       pop: '63M',   area: '945,087 km²', lang: 'Swahili, English', fact: 'Home to Mount Kilimanjaro, the highest peak in Africa.' },
      { name: 'Ghana',        capital: 'Accra',        pop: '32M',   area: '238,533 km²', lang: 'English', fact: 'First sub-Saharan African country to gain independence, in 1957.' },
    ]
  },
  {
    id: 'asia', name: 'Asia', emoji: '🌏', color: '#ef4444',
    desc: "The largest continent on Earth, home to over 4 billion people and the world's highest mountain.",
    countries: [
      { name: 'China',        capital: 'Beijing',     pop: '1.4B',  area: '9,596,960 km²', lang: 'Mandarin', fact: 'The Great Wall of China stretches over 21,000 kilometres.' },
      { name: 'India',        capital: 'New Delhi',   pop: '1.4B',  area: '3,287,263 km²', lang: '22 official languages', fact: "The world's largest democracy with over 2,000 languages spoken." },
      { name: 'Japan',        capital: 'Tokyo',       pop: '125M',  area: '377,975 km²', lang: 'Japanese', fact: 'Made up of 6,852 islands, with Mount Fuji as its highest peak.' },
      { name: 'Saudi Arabia', capital: 'Riyadh',      pop: '35M',   area: '2,149,690 km²', lang: 'Arabic', fact: 'Contains the two holiest cities in Islam: Mecca and Medina.' },
      { name: 'Indonesia',    capital: 'Jakarta',     pop: '275M',  area: '1,904,569 km²', lang: 'Indonesian', fact: 'The largest archipelago nation in the world with over 17,000 islands.' },
    ]
  },
  {
    id: 'europe', name: 'Europe', emoji: '🌍', color: '#3b82f6',
    desc: 'A continent of rich history, diverse cultures, and 44 countries.',
    countries: [
      { name: 'France',         capital: 'Paris',    pop: '68M',  area: '551,695 km²', lang: 'French', fact: 'The most visited country in the world, with over 90 million tourists per year.' },
      { name: 'Germany',        capital: 'Berlin',   pop: '83M',  area: '357,114 km²', lang: 'German', fact: 'Has the largest economy in Europe.' },
      { name: 'United Kingdom', capital: 'London',   pop: '67M',  area: '242,495 km²', lang: 'English', fact: 'Made up of England, Scotland, Wales and Northern Ireland.' },
      { name: 'Italy',          capital: 'Rome',     pop: '60M',  area: '301,340 km²', lang: 'Italian', fact: "Rome was the centre of one of history's greatest empires for 500 years." },
      { name: 'Spain',          capital: 'Madrid',   pop: '47M',  area: '505,990 km²', lang: 'Spanish', fact: 'Spanish is the second most spoken language in the world.' },
    ]
  },
  {
    id: 'americas', name: 'The Americas', emoji: '🌎', color: '#10b981',
    desc: 'Two continents joined together, stretching from the Arctic to Antarctica.',
    countries: [
      { name: 'USA',       capital: 'Washington D.C.', pop: '335M', area: '9,833,517 km²', lang: 'English', fact: "Has 50 states and is the world's largest economy." },
      { name: 'Brazil',    capital: 'Brasília',         pop: '215M', area: '8,515,767 km²', lang: 'Portuguese', fact: "Home to the Amazon rainforest, the world's largest tropical forest." },
      { name: 'Canada',    capital: 'Ottawa',           pop: '38M',  area: '9,984,670 km²', lang: 'English, French', fact: 'The second largest country in the world by land area.' },
      { name: 'Mexico',    capital: 'Mexico City',      pop: '130M', area: '1,964,375 km²', lang: 'Spanish', fact: 'The ancient Aztec empire had its capital where Mexico City stands today.' },
      { name: 'Argentina', capital: 'Buenos Aires',     pop: '46M',  area: '2,780,400 km²', lang: 'Spanish', fact: 'Home of tango music and dance, and the spectacular Iguazu Falls.' },
    ]
  },
  {
    id: 'oceania', name: 'Oceania', emoji: '🌏', color: '#8b5cf6',
    desc: 'The smallest continent, containing thousands of islands across the Pacific Ocean.',
    countries: [
      { name: 'Australia',       capital: 'Canberra',      pop: '26M',   area: '7,692,024 km²', lang: 'English', fact: 'Home to unique animals found nowhere else, like the kangaroo and platypus.' },
      { name: 'New Zealand',     capital: 'Wellington',    pop: '5M',    area: '268,838 km²', lang: 'English, Maori', fact: 'The first country to give women the right to vote, in 1893.' },
      { name: 'Papua New Guinea',capital: 'Port Moresby',  pop: '10M',   area: '462,840 km²', lang: '800+ languages', fact: 'Has over 800 different languages — more than any other country.' },
      { name: 'Fiji',            capital: 'Suva',          pop: '0.9M',  area: '18,274 km²', lang: 'English, Fijian', fact: 'Made up of 333 islands in the South Pacific Ocean.' },
    ]
  },
]

const WONDERS = [
  { name: 'Great Wall of China',   location: 'China',  emoji: '🏯', built: '7th century BC – 1644 AD', fact: 'Built over many centuries, it stretches over 21,000 km and was built to defend against invasions.' },
  { name: 'Machu Picchu',          location: 'Peru',   emoji: '🏔️', built: 'c. 1450 AD', fact: 'An Incan city built high in the Andes Mountains, abandoned and rediscovered in 1911.' },
  { name: 'Colosseum',             location: 'Italy',  emoji: '🏛️', built: '70–80 AD', fact: 'Could hold 50,000–80,000 spectators and hosted gladiator battles for centuries.' },
  { name: 'Taj Mahal',             location: 'India',  emoji: '🕌', built: '1631–1653', fact: 'Built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal.' },
  { name: 'Chichen Itza',          location: 'Mexico', emoji: '🏺', built: 'c. 600 AD', fact: 'A Mayan pyramid that casts a snake-shaped shadow on the spring and autumn equinox.' },
  { name: 'Petra',                 location: 'Jordan', emoji: '🪨', built: '4th century BC', fact: 'An ancient city carved entirely out of rose-red rock, hidden in a desert canyon.' },
  { name: 'Christ the Redeemer',   location: 'Brazil', emoji: '✝️', built: '1922–1931', fact: 'Stands 30 metres tall atop Corcovado Mountain overlooking Rio de Janeiro.' },
]

function CountryModal({ country, continent, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#111827', border: '1px solid #1f2937', borderRadius: '18px',
        width: '100%', maxWidth: '560px', overflow: 'hidden'
      }}>
        <div style={{ background: continent.color + '15', borderBottom: \`2px solid \${continent.color}44\`, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f9fafb', margin: '0 0 4px' }}>{country.name}</h2>
              <p style={{ color: continent.color, fontWeight: 700, margin: 0, fontSize: '.85rem' }}>{continent.emoji} {continent.name}</p>
            </div>
            <button onClick={onClose} style={{
              padding: '7px 12px', borderRadius: '8px', border: '1px solid #374151',
              background: '#0f1520', color: '#9ca3af', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1
            }}>×</button>
          </div>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'CAPITAL',     value: country.capital },
              { label: 'POPULATION',  value: country.pop },
              { label: 'AREA',        value: country.area },
              { label: 'LANGUAGE(S)', value: country.lang },
            ].map(item => (
              <div key={item.label} style={{ background: '#0f1421', borderRadius: '10px', padding: '14px' }}>
                <p style={{ color: '#6b7280', fontSize: '.68rem', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '.5px' }}>{item.label}</p>
                <p style={{ color: '#f9fafb', fontWeight: 700, margin: 0, fontSize: '.88rem' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '16px' }}>
            <p style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '.7rem', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>🌟 DID YOU KNOW?</p>
            <p style={{ color: '#d1d5db', fontSize: '.88rem', margin: 0, lineHeight: 1.7 }}>{country.fact}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function WonderModal({ wonder, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#111827', border: '1px solid #1f2937', borderRadius: '18px',
        width: '100%', maxWidth: '500px', overflow: 'hidden'
      }}>
        <div style={{ background: 'rgba(245,158,11,0.1)', borderBottom: '2px solid rgba(245,158,11,0.3)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '2.8rem' }}>{wonder.emoji}</span>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f9fafb', margin: '0 0 3px' }}>{wonder.name}</h2>
                <p style={{ color: '#f59e0b', fontWeight: 700, margin: 0, fontSize: '.82rem' }}>📍 {wonder.location}</p>
              </div>
            </div>
            <button onClick={onClose} style={{
              padding: '7px 12px', borderRadius: '8px', border: '1px solid #374151',
              background: '#0f1520', color: '#9ca3af', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1
            }}>×</button>
          </div>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ background: '#0f1421', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
            <p style={{ color: '#6b7280', fontSize: '.68rem', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '.5px' }}>BUILT</p>
            <p style={{ color: '#f9fafb', fontWeight: 700, margin: 0 }}>{wonder.built}</p>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '16px' }}>
            <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '.7rem', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>🏆 WONDER FACT</p>
            <p style={{ color: '#d1d5db', fontSize: '.88rem', margin: 0, lineHeight: 1.7 }}>{wonder.fact}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContinentSection({ continent, onSelect }) {
  return (
    <div style={{ marginBottom: '52px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '20px', paddingBottom: '14px',
        borderBottom: \`2px solid \${continent.color}33\`
      }}>
        <span style={{ fontSize: '1.8rem' }}>{continent.emoji}</span>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 900, color: '#f9fafb', margin: 0, fontSize: '1.4rem' }}>{continent.name}</h2>
          <p style={{ color: '#6b7280', fontSize: '.78rem', margin: 0 }}>{continent.desc}</p>
        </div>
        <span style={{
          background: continent.color + '22', color: continent.color,
          fontSize: '.68rem', fontWeight: 800, padding: '3px 10px',
          borderRadius: '20px', border: \`1px solid \${continent.color}44\`
        }}>{continent.countries.length} countries</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
        {continent.countries.map(c => (
          <button key={c.name} onClick={() => onSelect(c)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = continent.color; e.currentTarget.style.background = continent.color + '11' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.background = '#0d1117' }}
            style={{
              background: '#0d1117', border: '1px solid #1f2937', borderRadius: '12px',
              padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
              transition: 'border-color .15s, background .15s', width: '100%'
            }}>
            <p style={{ fontWeight: 700, color: '#f9fafb', fontSize: '.88rem', margin: '0 0 4px' }}>{c.name}</p>
            <p style={{ color: '#6b7280', fontSize: '.72rem', margin: 0 }}>Capital: {c.capital}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function WorldExplorer() {
  const [tab,     setTab]     = useState('continents')
  const [modal,   setModal]   = useState(null)
  const [continent, setContinent] = useState(null)

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '28px 24px' }}>
      {modal?.type === 'country'  && <CountryModal country={modal.data} continent={modal.continent} onClose={() => setModal(null)} />}
      {modal?.type === 'wonder'   && <WonderModal  wonder={modal.data}  onClose={() => setModal(null)} />}

      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f9fafb', margin: '0 0 8px' }}>🌍 World Explorer</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '.88rem' }}>
            Click any country or wonder to learn more
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', background: '#111827', padding: '5px', borderRadius: '12px' }}>
          {[['continents', '🌍 Continents & Countries'], ['wonders', '🏆 World Wonders']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, padding: '10px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '.82rem',
                background: tab === id ? '#6366f1' : 'transparent', color: tab === id ? '#fff' : '#6b7280' }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'continents' && CONTINENTS.map(c => (
          <ContinentSection key={c.id} continent={c}
            onSelect={country => setModal({ type: 'country', data: country, continent: c })} />
        ))}

        {tab === 'wonders' && (
          <div>
            <p style={{ color: '#9ca3af', fontSize: '.875rem', marginBottom: '24px' }}>
              The Seven Wonders of the Modern World — voted by over 100 million people. Click any to learn more.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
              {WONDERS.map(w => (
                <button key={w.name} onClick={() => setModal({ type: 'wonder', data: w })}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = 'rgba(245,158,11,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.background = '#0d1117' }}
                  style={{
                    background: '#0d1117', border: '1px solid #1f2937', borderRadius: '12px',
                    padding: '16px', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color .15s, background .15s', width: '100%'
                  }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>{w.emoji}</span>
                  <p style={{ fontWeight: 700, color: '#f9fafb', margin: '0 0 4px', fontSize: '.9rem' }}>{w.name}</p>
                  <p style={{ color: '#f59e0b', fontSize: '.72rem', margin: 0, fontWeight: 600 }}>📍 {w.location}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
`

// ─── WRITE FILES ─────────────────────────────────────────────────────────────
const base = path.join(__dirname, 'frontend', 'src', 'pages', 'student')

const storiesPath = path.join(base, 'Stories.jsx')
const worldPath   = path.join(base, 'WorldExplorer.jsx')

fs.writeFileSync(storiesPath, storiesContent, 'utf8')
console.log('✅ Written: ' + storiesPath)

fs.writeFileSync(worldPath, worldContent, 'utf8')
console.log('✅ Written: ' + worldPath)

console.log('\n🎉 Done! Both files updated. Vite will hot-reload automatically.')
