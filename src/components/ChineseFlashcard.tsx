'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, Sparkles, MapPin, BookOpen } from 'lucide-react'
import type { ChineseWord, VocabInsight } from '@/lib/chinese-types'
import { getPlatformLinks, WORD_CATEGORIES } from '@/lib/hsk5-words'
import { cn } from '@/lib/utils'

interface Props {
  word: ChineseWord
  showPinyin?: boolean
}

export function ChineseFlashcard({ word, showPinyin = false }: Props) {
  const [flipped, setFlipped] = useState(false)
  const [insight, setInsight] = useState<VocabInsight | null>(null)
  const [insightOpen, setInsightOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cat = WORD_CATEGORIES[word.category]
  const links = getPlatformLinks(word)

  async function loadInsight() {
    if (insight) {
      setInsightOpen(!insightOpen)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chinese/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hanzi: word.hanzi,
          pinyin: word.pinyin,
          meaning: word.meaning,
          meaningJa: word.meaningJa,
        }),
      })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setInsight(data.insight)
      setInsightOpen(true)
    } catch {
      setError('読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {/* Flashcard */}
      <div
        className="flip-card w-full cursor-pointer"
        onClick={() => setFlipped(!flipped)}
        style={{ height: '220px' }}
      >
        <div className={cn('flip-card-inner w-full h-full', flipped && 'flipped')}>
          {/* Front */}
          <div className="flip-card-front bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full mb-4', cat.bgColor, cat.color)}>
              {cat.emoji} {cat.label}
            </span>
            <div className="text-6xl font-bold text-gray-900 tracking-wider">{word.hanzi}</div>
            {showPinyin && (
              <div className="mt-3 text-lg text-indigo-500 font-medium">{word.pinyin}</div>
            )}
            <p className="mt-4 text-xs text-gray-400">タップして意味を確認</p>
          </div>

          {/* Back */}
          <div className="flip-card-back bg-indigo-600 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center text-white">
            <div className="text-2xl font-bold mb-1">{word.hanzi}</div>
            <div className="text-indigo-200 text-base mb-3">{word.pinyin}</div>
            <div className="text-center">
              <div className="text-white text-sm font-medium leading-relaxed">{word.meaning}</div>
              <div className="text-indigo-200 text-sm mt-1">{word.meaningJa}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform links */}
      <div className="flex gap-2 justify-center flex-wrap">
        <a
          href={links.xiaohongshu}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={11} />
          小红书で検索
        </a>
        <a
          href={links.baiduDict}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <BookOpen size={11} />
          百度词典
        </a>
        {links.baiduMap && (
          <a
            href={links.baiduMap}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin size={11} />
            百度地図
          </a>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); loadInsight() }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors"
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
          AI解説
        </button>
      </div>

      {/* AI Insight panel */}
      {insightOpen && insight && (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4 space-y-4 text-sm">
          {/* Example sentences */}
          {insight.exampleSentences?.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">例文</div>
              <div className="space-y-3">
                {insight.exampleSentences.map((s, i) => (
                  <div key={i} className="pl-3 border-l-2 border-indigo-200">
                    <div className="font-medium text-gray-900">{s.hanzi}</div>
                    <div className="text-xs text-indigo-500">{s.pinyin}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.meaningJa}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cultural note */}
          {insight.culturalNote && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">文化メモ</div>
              <p className="text-gray-700 leading-relaxed text-xs">{insight.culturalNote}</p>
            </div>
          )}

          {/* Memory tip */}
          {insight.memoryTip && (
            <div className="bg-yellow-50 rounded-xl p-3">
              <div className="text-xs font-semibold text-yellow-700 mb-1">覚え方のコツ</div>
              <p className="text-yellow-800 text-xs leading-relaxed">{insight.memoryTip}</p>
            </div>
          )}

          {/* Related words */}
          {insight.relatedWords?.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">関連単語</div>
              <div className="flex flex-wrap gap-2">
                {insight.relatedWords.map((w, i) => (
                  <span key={i} className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs">
                    <span className="font-semibold text-gray-900">{w.hanzi}</span>
                    <span className="text-gray-400 mx-1">·</span>
                    <span className="text-gray-500">{w.meaning}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 小红书 post */}
          {insight.xiaohongshuPost && (
            <div className="bg-red-50 rounded-xl p-3">
              <div className="text-xs font-semibold text-red-600 mb-1">小红书スタイル投稿</div>
              <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-line">{insight.xiaohongshuPost}</p>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  )
}
