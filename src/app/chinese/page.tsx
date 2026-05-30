'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { HSK5_WORDS, WORD_CATEGORIES } from '@/lib/hsk5-words'
import type { VocabProgress, WordCategory } from '@/lib/chinese-types'
import { BookOpen, Zap, Trophy, Target, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

function loadProgress(): VocabProgress {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('chinese_progress') || '{}')
  } catch {
    return {}
  }
}

export default function ChineseDashboard() {
  const [progress, setProgress] = useState<VocabProgress>({})

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const total = HSK5_WORDS.length
  const mastered = Object.values(progress).filter((p) => p.status === 'mastered').length
  const learning = Object.values(progress).filter((p) => p.status === 'learning' || p.status === 'review').length
  const studied = Object.values(progress).length
  const newWords = total - studied

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
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🇨🇳</span>
            <h1 className="text-2xl font-black text-gray-900">中国語 HSK5 単語帳</h1>
          </div>
          <p className="text-gray-500 text-sm">
            全{total}語収録 · HSK5級合格を目指そう
          </p>
        </div>

        {/* Progress overview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">学習進捗</h2>
            <span className="text-2xl font-black text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-xl font-black text-green-600">{mastered}</div>
              <div className="text-xs text-green-700 mt-0.5">マスター</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <div className="text-xl font-black text-orange-600">{learning}</div>
              <div className="text-xs text-orange-700 mt-0.5">学習中</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-black text-gray-600">{newWords}</div>
              <div className="text-xs text-gray-500 mt-0.5">未学習</div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link
            href="/chinese/study"
            className="flex items-center gap-4 p-4 bg-indigo-600 text-white rounded-2xl shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-xl">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="font-bold">フラッシュカード学習</div>
              <div className="text-indigo-200 text-xs mt-0.5">
                {newWords > 0 ? `${Math.min(newWords, 20)}語から開始` : '復習する'}
              </div>
            </div>
          </Link>
          <Link
            href="/chinese/quiz"
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 text-gray-900 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-xl">
              <Zap size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="font-bold">クイズに挑戦</div>
              <div className="text-gray-500 text-xs mt-0.5">10問の択一クイズ</div>
            </div>
          </Link>
        </div>

        {/* Category grid */}
        <section className="mb-6">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target size={16} className="text-indigo-600" />
            カテゴリー別
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
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
            外部ツールと連携して深く学ぶ
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
                  <div className="font-bold flex items-center gap-1">
                    {p.name}
                    <ExternalLink size={12} className="opacity-60" />
                  </div>
                  <div className="text-xs opacity-80 mt-0.5 leading-relaxed">{p.desc}</div>
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            各単語のカードからも直接リンクを開けます
          </p>
        </section>
      </main>
    </div>
  )
}
