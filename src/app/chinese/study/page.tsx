'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { ChineseFlashcard } from '@/components/ChineseFlashcard'
import { HSK5_WORDS, WORD_CATEGORIES } from '@/lib/hsk5-words'
import type { VocabProgress, WordCategory } from '@/lib/chinese-types'
import { ArrowLeft, Check, X, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

function loadProgress(): VocabProgress {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('chinese_progress') || '{}')
  } catch {
    return {}
  }
}

function saveProgress(progress: VocabProgress) {
  localStorage.setItem('chinese_progress', JSON.stringify(progress))
}

const STATUS_ORDER = { new: 0, learning: 1, review: 2, mastered: 3 }

function StudyContent() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category') as WordCategory | null

  const [progress, setProgress] = useState<VocabProgress>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showPinyin, setShowPinyin] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const queue = useMemo(() => {
    const words = categoryFilter
      ? HSK5_WORDS.filter((w) => w.category === categoryFilter)
      : HSK5_WORDS
    return [...words].sort((a, b) => {
      const sa = progress[a.id]?.status ?? 'new'
      const sb = progress[b.id]?.status ?? 'new'
      return STATUS_ORDER[sa] - STATUS_ORDER[sb]
    }).slice(0, 20)
  }, [categoryFilter, progress])

  const currentWord = queue[currentIndex]
  const catInfo = categoryFilter ? WORD_CATEGORIES[categoryFilter] : null

  function advance(knew: boolean) {
    if (!currentWord) return

    const prev = progress[currentWord.id]
    const prevStatus = prev?.status ?? 'new'
    const prevReviewCount = prev?.reviewCount ?? 0
    const prevCorrectCount = prev?.correctCount ?? 0

    let nextStatus = prevStatus
    if (knew) {
      if (prevStatus === 'new') nextStatus = 'learning'
      else if (prevStatus === 'learning') nextStatus = 'review'
      else if (prevStatus === 'review') nextStatus = 'mastered'
    } else {
      if (prevStatus === 'mastered') nextStatus = 'review'
    }

    const updated: VocabProgress = {
      ...progress,
      [currentWord.id]: {
        wordId: currentWord.id,
        status: nextStatus,
        lastReviewed: new Date().toISOString(),
        reviewCount: prevReviewCount + 1,
        correctCount: prevCorrectCount + (knew ? 1 : 0),
      },
    }
    setProgress(updated)
    saveProgress(updated)

    if (knew) setSessionCorrect((c) => c + 1)
    setSessionTotal((t) => t + 1)

    if (currentIndex + 1 >= queue.length) {
      setSessionDone(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setKey((k) => k + 1)
    }
  }

  function restart() {
    setCurrentIndex(0)
    setSessionCorrect(0)
    setSessionTotal(0)
    setSessionDone(false)
    setKey((k) => k + 1)
  }

  if (sessionDone) {
    const pct = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <NavBar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">
              {pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">セッション完了！</h2>
            <p className="text-gray-500 text-sm mb-6">
              {sessionTotal}問中 {sessionCorrect}問正解（{pct}%）
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={restart}
                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                <RotateCcw size={16} />
                もう一周する
              </button>
              <Link
                href="/chinese"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:shadow-sm transition-all"
              >
                ダッシュボードへ
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <NavBar />
      <main className="flex-1 flex flex-col p-4 md:p-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/chinese"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            戻る
          </Link>
          <div className="flex items-center gap-3">
            {catInfo && (
              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', catInfo.bgColor, catInfo.color)}>
                {catInfo.emoji} {catInfo.label}
              </span>
            )}
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showPinyin ? <EyeOff size={14} /> : <Eye size={14} />}
              ピンイン
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>{currentIndex + 1} / {queue.length}</span>
            <span>正解: {sessionCorrect}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((currentIndex) / queue.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        {currentWord && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <ChineseFlashcard key={key} word={currentWord} showPinyin={showPinyin} />

            {/* Action buttons */}
            <div className="flex gap-4 w-full max-w-sm">
              <button
                onClick={() => advance(false)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-red-200 text-red-500 rounded-2xl font-bold hover:bg-red-50 hover:border-red-300 transition-all"
              >
                <X size={20} />
                わからない
              </button>
              <button
                onClick={() => advance(true)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all"
              >
                <Check size={20} />
                わかった！
              </button>
            </div>

            {/* Word status badge */}
            {progress[currentWord.id] && (
              <div className="text-xs text-gray-400">
                現在のステータス:{' '}
                <span className={cn(
                  'font-semibold',
                  progress[currentWord.id].status === 'mastered' ? 'text-green-600' :
                  progress[currentWord.id].status === 'review' ? 'text-blue-600' :
                  progress[currentWord.id].status === 'learning' ? 'text-orange-500' :
                  'text-gray-500'
                )}>
                  {{
                    new: '新規',
                    learning: '学習中',
                    review: '復習',
                    mastered: 'マスター',
                  }[progress[currentWord.id].status]}
                </span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-gray-400">読み込み中...</div>}>
      <StudyContent />
    </Suspense>
  )
}
