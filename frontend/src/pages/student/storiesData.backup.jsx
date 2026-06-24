import { useState, useMemo, useEffect, useRef } from 'react'

// ==================== DATA ====================
// 🟢 PASTE YOUR PREMADE_STORIES OBJECT HERE (unchanged)
const PREMADE_STORIES = {
  // ... your whole object
}
// =============================================

// --------------- local storage helpers ---------------
const STORAGE_KEY_PROGRESS = 'story_progress'
const STORAGE_KEY_FAVOURITES = 'story_favs'

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS)) || {} } catch { return {} }
}
function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(p))
}
function loadFavourites() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_FAVOURITES)) || [] } catch { return [] }
}
function saveFavourites(f) {
  localStorage.setItem(STORAGE_KEY_FAVOURITES, JSON.stringify(f))
}
// ------- Streak / Points -------
const STORAGE_KEY_STREAK = 'story_streak'
function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_STREAK)) || { points: 0, lastDate: null, streak: 0 } } catch { return { points: 0, lastDate: null, streak: 0 } }
}
function saveStreak(s) { localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(s)) }
// ------- Recently viewed -------
const STORAGE_KEY_RECENT = 'story_recent'
function loadRecent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_RECENT)) || [] } catch { return [] }
}
function saveRecent(r) { localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(r)) }

// --------------- Story Card Component ---------------
function StoryCard({ story, genre, storyKey, isFavourite, onToggleFav, progress, onUpdateProgress, forceExpanded, onOpen }) {
  const [expanded, setExpanded] = useState(false)
  const isExpanded = forceExpanded !== undefined ? forceExpanded : expanded
  // Report opened story for recently viewed
  useEffect(() => {
    if (isExpanded && onOpen) onOpen(storyKey)
  }, [isExpanded])
  // ----- Read-aloud feature -----
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  useEffect(() => {
    // Print single story
  const printThisStory = (e) => {
    e.stopPropagation()
    const storyEl = document.getElementById('story-' + storyKey)
    if (!storyEl) return
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>${story.title}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; max-width: 700px; margin: 20px auto; color: #000; background: #fff; }
          h1 { font-size: 1.5rem; } p { margin-bottom: 1em; }
          button, .quiz-section, .actions, .back-to-top, .expand-btn, .favourite, .speaker, .done-check { display: none !important; }
          .story-content { display: block !important; }
        </style>
        </head>
        <body>${storyEl.querySelector('.story-content').outerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
  return () => {
      if (utteranceRef.current) speechSynthesis.cancel()
    }
  }, [])

  const toggleSpeech = (e) => {
    e.stopPropagation()
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    if (!window.speechSynthesis) return
    const utterance = new SpeechSynthesisUtterance(story.body.replace(/\\n/g, ' '))
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  // Reset quiz when story is collapsed or expanded again
  useEffect(() => { setQuizStarted(false); setCurrentQ(0); setSelected(null); setCorrectCount(0) }, [expanded])

  // Progress for this story
  const storyProgress = progress[storyKey] || {}
  const isStoryUnderstood = storyProgress?.understood || false

  const handleAnswer = (optionIdx) => {
    setSelected(optionIdx)
    const correct = story.questions[currentQ].answer === optionIdx
    if (correct) setCorrectCount(c => c + 1)
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQ < story.questions.length - 1) {
        setCurrentQ(c => c + 1)
        setSelected(null)
      } else {
        // Quiz finished
        setQuizStarted(false)
        onUpdateProgress(storyKey, true)  // mark as understood if all answered (can be refined)
      }
    }, 1200)
  }

  // Colour based on genre (can be customised)
  const genreColors = {
    adventure: '#3b82f6',
    fantasy: '#8b5cf6',
    scifi: '#10b981',
    horror: '#ef4444',
    humour: '#f59e0b',
    realistic: '#06b6d4',
    survival: '#f97316',
  }
  const color = genreColors[genre] || '#6b7280'

  // Print single story
  const printThisStory = (e) => {
    e.stopPropagation()
    const storyEl = document.getElementById('story-' + storyKey)
    if (!storyEl) return
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>${story.title}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; max-width: 700px; margin: 20px auto; color: #000; background: #fff; }
          h1 { font-size: 1.5rem; } p { margin-bottom: 1em; }
          button, .quiz-section, .actions, .back-to-top, .expand-btn, .favourite, .speaker, .done-check { display: none !important; }
          .story-content { display: block !important; }
        </style>
        </head>
        <body>${storyEl.querySelector('.story-content').outerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
  return (
    <div style={{
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      borderLeft: '4px solid ' + color
    }}>
      {/* Title + expand/collapse + fav + understood */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <button
          onClick={() => setExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', flex: 1 }}
        >
          <p style={{ fontWeight: 700, color: 'var(--text)', margin: 0, fontSize: '1rem' }}>
            {story.title} <span style={{ color: color, fontWeight: 400, fontSize: '.8rem' }}>({genre})</span>
          </p>
        </button>
        {/* Favourite star */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(storyKey) }}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: isFavourite ? '#f59e0b' : 'var(--sub)' }}
        >
          {isFavourite ? '★' : '☆'}
        </button>
        {/* Read aloud button */}
        <button
          onClick={(e) => toggleSpeech(e)}
          aria-label={isSpeaking ? 'Stop reading' : 'Read story aloud'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: isSpeaking ? '#ef4444' : 'var(--sub)' }}
        >
          {isSpeaking ? '🔊' : '🔈'}
        </button>
        {/* Print this story */}
        <button
          onClick={(e) => { e.stopPropagation(); printThisStory(e); }}
          aria-label="Print this story"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--sub)' }}
        >
          🖨️
        </button>
        {/* Understood checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '.75rem', color: 'var(--sub)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isStoryUnderstood}
            onChange={(e) => {
              e.stopPropagation()
              onUpdateProgress(storyKey, e.target.checked)
            }}
            style={{ width: '16px', height: '16px', accentColor: color }}
          />
          Done
        </label>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{ maxHeight: isExpanded ? '2000px' : '0px', overflow: 'hidden', transition: 'max-height 0.4s ease-in-out' }}>
        <div style={{ marginTop: '16px' }}>
          {/* Story body – split into paragraphs */}
          {story.body.split('\n').map((para, i) => (
            <p key={i} style={{ color: 'var(--text)', fontSize: '.9rem', lineHeight: 1.8, marginBottom: '12px' }}>{para}</p>
          ))}

          {/* Quiz section */}
          {!quizStarted && story.questions?.length > 0 && (
            <button
              onClick={() => setQuizStarted(true)}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                background: color,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '.85rem',
                cursor: 'pointer'
              }}
            >
              Start Quiz ({story.questions.length} questions)
            </button>
          )}

          {quizStarted && (
            <div style={{ marginTop: '16px', background: 'var(--bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '8px' }}>
                Question {currentQ + 1} of {story.questions.length}
              </p>
              <p style={{ marginBottom: '12px' }}>{story.questions[currentQ].q}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {story.questions[currentQ].options.map((opt, oidx) => {
                  const isCorrect = story.questions[currentQ].answer === oidx
                  let borderColor = 'var(--border)'
                  let bg = 'var(--bg)'
                  if (selected !== null) {
                    if (selected === oidx) {
                      borderColor = isCorrect ? '#10b981' : '#ef4444'
                      bg = isCorrect ? '#10b98122' : '#ef444422'
                    }
                  }
                  // Print single story
  const printThisStory = (e) => {
    e.stopPropagation()
    const storyEl = document.getElementById('story-' + storyKey)
    if (!storyEl) return
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>${story.title}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; max-width: 700px; margin: 20px auto; color: #000; background: #fff; }
          h1 { font-size: 1.5rem; } p { margin-bottom: 1em; }
          button, .quiz-section, .actions, .back-to-top, .expand-btn, .favourite, .speaker, .done-check { display: none !important; }
          .story-content { display: block !important; }
        </style>
        </head>
        <body>${storyEl.querySelector('.story-content').outerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
  return (
                    <button
                      key={oidx}
                      disabled={selected !== null}
                      onClick={() => handleAnswer(oidx)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: `2px solid ${borderColor}`,
                        background: bg,
                        cursor: selected !== null ? 'default' : 'pointer',
                        fontSize: '.85rem',
                        color: 'var(--text)',
                        textAlign: 'left'
                      }}
                    >
                      {opt}
                      {selected !== null && selected === oidx && (
                        <span style={{ marginLeft: '8px', color: isCorrect ? '#10b981' : '#ef4444' }}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              {selected !== null && currentQ === story.questions.length - 1 && (
                <p style={{ marginTop: '12px', fontWeight: 700, color: '#10b981' }}>
                  Quiz finished! You got {correctCount}/{story.questions.length} correct.
                </p>
              )}
            </div>
          )}
        </div>
          </div>
      )}
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
export default function StoryLibrary() {
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [streak, setStreak] = useState(loadStreak)
  const [favourites, setFavourites] = useState(loadFavourites);
  const [recentStories, setRecentStories] = useState(loadRecent)
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => { saveFavourites(favourites) }, [favourites]);
  useEffect(() => { saveRecent(recentStories) }, [recentStories]);
  useEffect(() => { saveProgress(progress) }, [progress]);
  useEffect(() => { saveStreak(streak) }, [streak])

  // Listen for quiz completions to update streak
  useEffect(() => {
    const handler = (e) => {
      const today = new Date().toDateString()
      setStreak(prev => {
        const points = prev.points + 5
        let streak = prev.streak
        let lastDate = prev.lastDate
        if (lastDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          if (lastDate === yesterday) {
            streak += 1
          } else {
            streak = 1
          }
          lastDate = today
        }
        return { points, streak, lastDate }
      })
    }
    window.addEventListener('quizCompleted', handler)
    return () => window.removeEventListener('quizCompleted', handler)
  }, [])
  const toggleFav = (key) => {
    setFavourites(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }
  const updateProgress = (key, understood) => {
    setProgress(prev => {
      const next = { ...prev }
      next[key] = { understood }
      return next
    })
  }

  // Track opened stories
  const handleOpenStory = (storyKey) => {
    setRecentStories(prev => {
      const filtered = prev.filter(k => k !== storyKey)
      return [storyKey, ...filtered].slice(0, 5)
    })
  }
  // Genres list
  const genres = Object.keys(PREMADE_STORIES)

  // Compute filtered stories
  const filtered = useMemo(() => {
    let result = []
    for (let genre of genres) {
      if (activeGenre && genre !== activeGenre) continue
      const stories = PREMADE_STORIES[genre] || []
      if (search) {
        result.push({
          genre,
          stories: stories.filter(s =>
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.body.toLowerCase().includes(search.toLowerCase())
          )
        })
      } else {
        result.push({ genre, stories })
      }
    }
    return result.filter(g => g.stories.length > 0)
  }, [search, activeGenre])

  // Favourites list
  const favStories = useMemo(() => {
    const all = []
    for (let genre of genres) {
      const stories = PREMADE_STORIES[genre] || []
      stories.forEach((s, idx) => {
        const key = `${genre}-${idx}`
        if (favourites.includes(key)) {
          all.push({ ...s, key, genre })
        }
      })
    }
    return all
  }, [favourites])

  // Back to top
  const [showBackToTop, setShowBackToTop] = useState(false)
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Print single story
  const printThisStory = (e) => {
    e.stopPropagation()
    const storyEl = document.getElementById('story-' + storyKey)
    if (!storyEl) return
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>${story.title}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; max-width: 700px; margin: 20px auto; color: #000; background: #fff; }
          h1 { font-size: 1.5rem; } p { margin-bottom: 1em; }
          button, .quiz-section, .actions, .back-to-top, .expand-btn, .favourite, .speaker, .done-check { display: none !important; }
          .story-content { display: block !important; }
        </style>
        </head>
        <body>${storyEl.querySelector('.story-content').outerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
  return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Print single story
  const printThisStory = (e) => {
    e.stopPropagation()
    const storyEl = document.getElementById('story-' + storyKey)
    if (!storyEl) return
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>${story.title}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; max-width: 700px; margin: 20px auto; color: #000; background: #fff; }
          h1 { font-size: 1.5rem; } p { margin-bottom: 1em; }
          button, .quiz-section, .actions, .back-to-top, .expand-btn, .favourite, .speaker, .done-check { display: none !important; }
          .story-content { display: block !important; }
        </style>
        </head>
        <body>${storyEl.querySelector('.story-content').outerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
  return (
    <div id="story-library" style={{ maxWidth: '780px' }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #story-library, #story-library * { visibility: visible; }
          #story-library { position: absolute; left: 0; top: 0; width: 100%; }
          input, button, .back-to-top { display: none !important; }
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)' }}>Story Library</h1>
        <p style={{ fontSize: '.875rem', color: 'var(--sub)', marginBottom: '8px' }}>Read, enjoy, and test your understanding.</p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '.8rem', color: 'var(--sub)', marginBottom: '8px' }}>
          <span>⭐ Points: {streak.points}</span>
          <span>🔥 Streak: {streak.streak} day{streak.streak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search stories..."
          style={{
            width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)',
            borderRadius: '12px', padding: '12px 16px', color: 'var(--text)',
            fontSize: '.9rem', outline: 'none', boxSizing: 'border-box'
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '1.2rem', cursor: 'pointer'
          }} aria-label="Clear search">✕</button>
        )}
      </div>

      {/* Genre tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveGenre(null)}
          style={{
            padding: '6px 14px', borderRadius: '20px', border: '1.5px solid var(--border)',
            background: activeGenre === null ? 'var(--text)' : 'var(--bg)',
            color: activeGenre === null ? 'var(--bg)' : 'var(--text)',
            cursor: 'pointer', fontSize: '.8rem', fontWeight: 600
          }}
        >All</button>
        {genres.map(g => (
          <button
            key={g}
            onClick={() => setActiveGenre(activeGenre === g ? null : g)}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: '1.5px solid var(--border)',
              background: activeGenre === g ? 'var(--text)' : 'var(--bg)',
              color: activeGenre === g ? 'var(--bg)' : 'var(--text)',
              cursor: 'pointer', fontSize: '.8rem', textTransform: 'capitalize'
            }}
          >{g}</button>
        ))}
      </div>

      {/* Favourites section */}
      /* Recently viewed section */
      {recentStories.length > 0 && (
        <div style={{ marginBottom: '24px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', color: 'var(--text)', fontSize: '1rem' }}>🕒 Recently Viewed</h3>
          {recentStories.map(recentKey => {
            const [genre, idx] = recentKey.split('-')
            const story = PREMADE_STORIES[genre] && PREMADE_STORIES[genre][parseInt(idx)]
            if (!story) return null
            return (
              <StoryCard
                key={recentKey}
                story={story}
                genre={genre}
                storyKey={recentKey}
                isFavourite={favourites.includes(recentKey)}
                onToggleFav={toggleFav}
                progress={progress}
                onUpdateProgress={updateProgress}
                onOpen={handleOpenStory}
              />
            )
          })}
        </div>
      )}
{favStories.length > 0 && (
        <div style={{ marginBottom: '32px', background: 'var(--bg)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', color: '#f59e0b', fontSize: '1rem' }}>⭐ My Favourites</h3>
          {favStories.map(story => (
            <StoryCard
              key={story.key}
              story={story}
              genre={story.genre}
              storyKey={story.key}
              isFavourite={true}
              onToggleFav={toggleFav}
              progress={progress}
              onUpdateProgress={updateProgress}
            />
          ))}
        </div>
      )}

      {/* Genre sections */}
      {filtered.map(({ genre, stories }) => (
        <div key={genre} style={{ marginBottom: '48px' }}>
          <h2 style={{ textTransform: 'capitalize', color: 'var(--text)', fontSize: '1.2rem', marginBottom: '16px' }}>
            {genre} <span style={{ fontSize: '.8rem', color: 'var(--sub)' }}>({stories.length} stories)</span>
          </h2>
          {stories.map((story, idx) => {
            const storyKey = `${genre}-${idx}`
            // Print single story
  const printThisStory = (e) => {
    e.stopPropagation()
    const storyEl = document.getElementById('story-' + storyKey)
    if (!storyEl) return
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>${story.title}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; max-width: 700px; margin: 20px auto; color: #000; background: #fff; }
          h1 { font-size: 1.5rem; } p { margin-bottom: 1em; }
          button, .quiz-section, .actions, .back-to-top, .expand-btn, .favourite, .speaker, .done-check { display: none !important; }
          .story-content { display: block !important; }
        </style>
        </head>
        <body>${storyEl.querySelector('.story-content').outerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
  return (
              <StoryCard
                key={storyKey}
                story={story}
                genre={genre}
                storyKey={storyKey}
                isFavourite={favourites.includes(storyKey)}
                onToggleFav={toggleFav}
                progress={progress}
                onUpdateProgress={updateProgress}
              />
            )
          })}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--sub)' }}>
          <p>No stories found for "{search}"</p>
        </div>
      )}

      {showBackToTop && (
        <button className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '24px', right: '24px',
            background: 'var(--bg)', border: '1.5px solid var(--border)',
            borderRadius: '50%', width: '44px', height: '44px',
            fontSize: '1.5rem', color: 'var(--text)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 1000
          }}
          aria-label="Back to top"
        >↑</button>
      )}
    </div>
  )
}
