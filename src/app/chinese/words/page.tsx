'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { HSK5_WORDS, WORD_CATEGORIES, getPlatformLinks } from '@/lib/hsk5-words'
import type { VocabProgress, WordCategory, WordStatus } from '@/lib/chinese-types'
import { ArrowLeft, Search, ExternalLink, BookOpen, MapPin, X, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function loadProgress(): VocabProgress {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('chinese_progress') || '{}')
  } catch {
    return {}
  }
}

const STATUS_LABELS: Record<WordStatus | 'all', string> = {
  all: 'すべて',
  new: '新規',
  learning: '学習中',
  review: '復習',
  mastered: 'マスター',
}

const STATUS_COLORS: Record<WordStatus, string> = {
  new: 'bg-gray-100 text-gray-500',
  learning: 'bg-orange-100 text-orange-700',
  review: 'bg-blue-100 text-blue-700',
  mastered: 'bg-green-100 text-green-700',
}

export default function WordListPage() {
  const [progress, setProgress] = useState<VocabProgress>({})
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<WordCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<WordStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const filtered = useMemo(() => {
    let words = HSK5_WORDS

    if (categoryFilter !== 'all') {
      words = words.filter((w) => w.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      words = words.filter((w) => {
        const s = progress[w.id]?.status ?? 'new'
        return s === statusFilter
      })
    }

    const q = search.trim().toLowerCase()
    if (q) {
      words = words.filter(
        (w) =>
          w.hanzi.includes(q) ||
          w.pinyin.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          w.meaningJa.includes(q)
      )
    }

    return words
  }, [progress, search, categoryFilter, statusFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<WordStatus, number> = { new: 0, learning: 0, review: 0, mastered: 0 }
    HSK5_WORDS.forEach((w) => {
      const s = progress[w.id]?.status ?? 'new'
      counts[s]++
    })
    return counts
  }, [progress])

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <NavBar />
      <main className="flex-1 flex flex-col p-4 md:p-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/chinese"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            戻る
          </Link>
          <h1 className="text-xl font-black text-gray-900">単語一覧</h1>
          <span className="text-sm text-gray-400 ml-auto">
            {filtered.length} / {HSK5_WORDS.length}語
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="漢字・ピンイン・意味で検索..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-2 scrollbar-none">
          {(['all', 'new', 'learning', 'review', 'mastered'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                statusFilter === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              )}
            >
              {STATUS_LABELS[s]}
              {s !== 'all' && (
                <span className="ml-1 opacity-70">{statusCounts[s]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              categoryFilter === 'all'
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            )}
          >
            全カテゴリ
          </button>
          {(Object.keys(WORD_CATEGORIES) as WordCategory[]).map((cat) => {
            const c = WORD_CATEGORIES[cat]
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  categoryFilter === cat
                    ? `${c.bgColor} ${c.color} border-current`
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                )}
              >
                {c.emoji} {c.label}
              </button>
            )
          })}
        </div>

        {/* Word list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              一致する単語が見つかりません
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((word) => {
                const status = progress[word.id]?.status ?? 'new'
                const links = getPlatformLinks(word)
                const cat = WORD_CATEGORIES[word.category]
                const isExpanded = expandedId === word.id

                return (
                  <div key={word.id}>
                    <button
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                        isExpanded && 'bg-indigo-50 hover:bg-indigo-50'
                      )}
                      onClick={() => setExpandedId(isExpanded ? null : word.id)}
                    >
                      {/* Hanzi */}
                      <span className="w-16 flex-shrink-0 text-xl font-bold text-gray-900 leading-none">
                        {word.hanzi}
                      </span>

                      {/* Pinyin + meaning */}
                      <span className="flex-1 min-w-0 text-left">
                        <span className="block text-xs text-indigo-400 font-medium">{word.pinyin}</span>
                        <span className="block text-sm text-gray-600 truncate">{word.meaningJa}</span>
                      </span>

                      {/* Category emoji + status */}
                      <span className="flex items-center gap-2 flex-shrink-0">
                        <span className="hidden sm:inline text-base" title={cat.label}>{cat.emoji}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[status])}>
                          {STATUS_LABELS[status]}
                        </span>
                      </span>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="px-4 pb-3 pt-1 bg-indigo-50 border-t border-indigo-100 space-y-2">
                        <p className="text-xs text-gray-500">{word.meaning}</p>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={links.xiaohongshu}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                          >
                            <ExternalLink size={10} />
                            小红书
                          </a>
                          <a
                            href={links.baiduDict}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                          >
                            <BookOpen size={10} />
                            百度词典
                          </a>
                          {links.baiduMap && (
                            <a
                              href={links.baiduMap}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                            >
                              <MapPin size={10} />
                              百度地図
                            </a>
                          )}
                          <a
                            href={`https://forvo.com/word/${encodeURIComponent(word.hanzi)}/#zh`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors"
                          >
                            <Volume2 size={10} />
                            発音 (Forvo)
                          </a>
                          <a
                            href={`https://tatoeba.org/ja/sentences/search?query=${encodeURIComponent(word.hanzi)}&from=cmn`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-medium hover:bg-yellow-100 transition-colors"
                          >
                            <ExternalLink size={10} />
                            例文 (Tatoeba)
                          </a>
                          <Link
                            href={`/chinese/study?category=${word.category}`}
                            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors"
                          >
                            カテゴリで学習 →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
