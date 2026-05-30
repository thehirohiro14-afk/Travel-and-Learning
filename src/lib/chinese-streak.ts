export interface StreakData {
  lastStudyDate: string
  currentStreak: number
  longestStreak: number
}

const KEY = 'chinese_streak'

const EMPTY: StreakData = { lastStudyDate: '', currentStreak: 0, longestStreak: 0 }

export function loadStreak(): StreakData {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

export function recordStudyActivity(): StreakData {
  const today = new Date().toISOString().split('T')[0]
  const prev = loadStreak()

  if (prev.lastStudyDate === today) return prev

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
  const newStreak = prev.lastStudyDate === yesterday ? prev.currentStreak + 1 : 1
  const updated: StreakData = {
    lastStudyDate: today,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, prev.longestStreak),
  }
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}
