'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { HSK5_WORDS, WORD_CATEGORIES } from '@/lib/hsk5-words'
import type { VocabProgress, WordCategory } from '@/lib/chinese-types'
import { loadStreak, type StreakData } from '@/lib/chinese-streak'
import { BookOpen, Zap, Trophy, Target, ExternalLink, List, Flame, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

function loadProgress(): VocabProgress {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('chinese_progress') || '{}')
  } catch {
    return {}
  }
}

function getTodayCount(progress: VocabProgress): number {
  const today = new Date().toISOString().split('T')[0]
  return Object.values(progress).filter((p) => p.lastReviewed?.startsWith(today)).length
}

export default function ChineseDashboard() {
  const [progress, setProgress] = useState<VocabProgress>({})
  const [streak, setStreak] = useState<StreakData>({ lastStudyDate: '', currentStreak: 0, longestStreak: 0 })

  useEffect(() => {
    const p = loadProgress()
    setProgress(p)
    setStreak(loadStreak())
  }, [])

  const total = HSK5_WORDS.length
  const mastered = Object.values(progress).filter((p) => p.status === 'mastered').length
  const learning = Object.values(progress).filter((p) => p.status === 'learning').length
  const reviewDue = Object.values(progress).filter((p) => p.status === 'review').length
  const studiedToday = getTodayCount(progress)
  const newWords = total - Object.keys(progress).length

  const progressPercent = Math.round((mastered / total) * 100)

  const categoryStats = (Object.keys(WORD_CATEGORIES) as WordCategory[]).map((cat) => {
    const words = HSK5_WORDS.filter((w) => w.category === cat)
    const masteredInCat = words.filter((w) => progress[w.id]?.status === 'mastered').length
    return { cat, words, masteredInCat }
  })

  const platforms = [
    {
      name: '小红书',
      desc: '中国の人気SNSで実際の使い方を確認',
      url: 'https://www.xiaohongshu.com/search_result?keyword=HSK5汉语&type=51',
      color: 'bg-red-50 border-red-200 text-red-700',
      icon: '📱',
    },
    {
      name: '百度词典',
      desc: '百度の辞書で詳細な語釈を調べる',
      url: 'https://dict.baidu.com/',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: '📖',
    },
    {
      name: '百度地图',
      desc: '地名・場所関連の単語を地図で確認',
      url: 'https://map.baidu.com/',
      color: 'bg-green-50 border-green-200 text-green-700',
      icon: '🗺️',
    },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <NavBar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🇨🇳</span>
            <h1 className="text-2xl font-black text-gray-900">中国語 HSK5 単語帳</h1>
          </div>
          <p className="text-gray-500 text-sm">全{total}語収録 · HSK5級合格を目指そう</p>
        </div>

        {/* Streak + today row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame size={16} className="text-orange-500" />
              <span className="text-xs font-medium text-orange-600">連続学習</span>
            </div>
            <div className="text-2xl font-black text-orange-600">{streak.currentStreak}</div>
            <div className="text-xs text-orange-400 mt-0.5">日</div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
            <div className="text-xs font-medium text-indigo-600 mb-1">今日学習</div>
            <div className="text-2xl font-black text-indigo-600">{studiedToday}</div>
            <div className="text-xs text-indigo-400 mt-0.5">語</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
            <div className="text-xs font-medium text-blue-600 mb-1">復習待ち</div>
            <div className="text-2xl font-black text-blue-600">{reviewDue + learning}</div>
            <div className="text-xs text-blue-400 mt-0.5">語</div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <div className="text-xs font-medium text-green-600 mb-1">マスター</div>
            <div className="text-2xl font-black text-green-600">{mastered}</div>
            <div className="text-xs text-green-400 mt-0.5">/ {total}語</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-900">全体進捗</h2>
            <span className="text-2xl font-black text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {streak.longestStreak > 0 && (
            <p className="text-xs text-gray-400 mt-2">最長連続記録: {streak.longestStreak}日</p>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <Link
            href="/chinese/study"
            className="flex items-center gap-4 p-4 bg-indigo-600 text-white rounded-2xl shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-xl flex-shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="font-bold text-sm">フラッシュカード</div>
              <div className="text-indigo-200 text-xs mt-0.5">
                {newWords > 0 ? `${Math.min(newWords, 20)}語から` : '復習する'}
              </div>
            </div>
          </Link>

          {reviewDue + learning > 0 && (
            <Link
              href="/chinese/study"
              className="flex items-center gap-4 p-4 bg-blue-500 text-white rounded-2xl shadow-sm hover:bg-blue-600 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-400 rounded-xl flex-shrink-0">
                <RotateCcw size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">復習モード</div>
                <div className="text-blue-100 text-xs mt-0.5">{reviewDue + learning}語が待機中</div>
              </div>
            </Link>
          )}

          <Link
            href="/chinese/quiz"
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 text-gray-900 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-xl flex-shrink-0">
              <Zap size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="font-bold text-sm">クイズ</div>
              <div className="text-gray-500 text-xs mt-0.5">10問の択一クイズ</div>
            </div>
          </Link>

          <Link
            href="/chinese/words"
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 text-gray-900 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0">
              <List size={20} className="text-gray-600" />
            </div>
            <div>
              <div className="font-bold text-sm">単語一覧</div>
              <div className="text-gray-500 text-xs mt-0.5">検索・絞り込み</div>
            </div>
          </Link>
        </div>

        {/* Category grid */}
        <section className="mb-5">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target size={16} className="text-indigo-600" />
            カテゴリー別進捗
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {categoryStats.map(({ cat, words, masteredInCat }) => {
              const c = WORD_CATEGORIES[cat]
              const pct = Math.round((masteredInCat / words.length) * 100)
              return (
                <Link
                  key={cat}
                  href={`/chinese/study?category=${cat}`}
                  className={cn(
                    'flex flex-col p-3 rounded-xl border hover:shadow-sm transition-all',
                    c.bgColor
                  )}
                >
                  <div className="text-xl mb-1">{c.emoji}</div>
                  <div className={cn('text-xs font-bold leading-tight', c.color)}>{c.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {masteredInCat}/{words.length}語
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-1 mt-1.5">
                    <div
                      className="bg-current h-1 rounded-full opacity-60 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Platform integration */}
        <section>
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Trophy size={16} className="text-indigo-600" />
            外部ツールで深く学ぶ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-start gap-3 p-4 rounded-2xl border hover:shadow-sm transition-all',
                  p.color
                )}
              >
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm flex items-center gap-1">
                    {p.name}
                    <ExternalLink size={12} className="opacity-60" />
                  </div>
                  <div className="text-xs opacity-80 mt-0.5 leading-relaxed">{p.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
