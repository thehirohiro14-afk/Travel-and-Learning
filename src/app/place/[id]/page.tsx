'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { QuizGame } from '@/components/QuizGame'
import { DEMO_PLACES } from '@/lib/demo-data'
import type { QuizQuestion } from '@/lib/types'
import { categoryColor, categoryLabel, formatDate, knowledgeScoreColor, knowledgeScoreLabel } from '@/lib/utils'
import {
  MapPin, Calendar, Camera, ChevronLeft, Brain, Sparkles, Trophy
} from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default function PlacePage({ params }: Props) {
  const { id } = use(params)
  const place = DEMO_PLACES.find((p) => p.id === id)

  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [quizError, setQuizError] = useState<string | null>(null)
  const [insight, setInsight] = useState<string | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'quiz'>('info')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#quiz') {
      setActiveTab('quiz')
    }
  }, [])

  if (!place) notFound()

  async function startQuiz() {
    setLoadingQuiz(true)
    setQuizError(null)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeName: place!.name,
          placeDescription: place!.description,
          count: 5,
        }),
      })
      if (!res.ok) throw new Error('Failed to generate quiz')
      const data = await res.json()
      setQuestions(data.questions)
    } catch {
      setQuizError('クイズの生成に失敗しました。もう一度お試しください。')
    } finally {
      setLoadingQuiz(false)
    }
  }

  async function loadInsight() {
    setLoadingInsight(true)
    try {
      const res = await fetch('/api/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeName: place!.name,
          placeDescription: place!.description,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setInsight(data.insight)
    } catch {
      setInsight(null)
    } finally {
      setLoadingInsight(false)
    }
  }

  function handleQuizComplete(score: number, total: number) {
    setQuizResult({ score, total })
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <NavBar />
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {/* Hero image */}
        <div className="relative h-52 md:h-72 bg-gray-200 overflow-hidden">
          {place.photos[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={place.photos[0].baseUrl}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-indigo-100 to-purple-100">
              📍
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Back button */}
          <Link
            href="/map"
            className="absolute top-4 left-4 flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
          >
            <ChevronLeft size={16} />
            戻る
          </Link>

          {/* Place name overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-full mb-2 inline-block ${categoryColor(place.category)}`}>
              {categoryLabel(place.category)}
            </span>
            <h1 className="text-2xl font-black text-white">{place.name}</h1>
            <div className="flex items-center gap-1 text-white/75 text-sm mt-1">
              <MapPin size={14} />
              {place.address}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5">
            <div className="flex items-center gap-1.5">
              <Calendar size={15} />
              <span>初訪問: {formatDate(place.firstVisit)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera size={15} />
              <span>{place.photos.length}枚の写真</span>
            </div>
            <div className={`flex items-center gap-1.5 font-semibold ${knowledgeScoreColor(place.knowledgeScore)}`}>
              <Trophy size={15} />
              <span>知識: {knowledgeScoreLabel(place.knowledgeScore)}</span>
            </div>
          </div>

          {/* Knowledge score bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>知識スコア</span>
              <span>{place.knowledgeScore}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${place.knowledgeScore}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-5">
            {(['info', 'quiz'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab === 'info' ? '📋 場所情報' : '🧠 クイズ'}
              </button>
            ))}
          </div>

          {/* Info tab */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-gray-900 mb-2">概要</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{place.description}</p>
              </div>

              {/* Fun facts */}
              <div>
                <h2 className="font-bold text-gray-900 mb-2">豆知識</h2>
                <ul className="space-y-2">
                  {place.funFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Insight */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-purple-600" />
                  <h3 className="font-bold text-purple-900 text-sm">AIが教える豆知識</h3>
                </div>
                {insight ? (
                  <p className="text-sm text-purple-800 leading-relaxed">{insight}</p>
                ) : (
                  <button
                    onClick={loadInsight}
                    disabled={loadingInsight}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingInsight ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                        生成中...
                      </>
                    ) : (
                      '✨ Claude AIに聞いてみる'
                    )}
                  </button>
                )}
              </div>

              {/* Photo grid */}
              {place.photos.length > 1 && (
                <div>
                  <h2 className="font-bold text-gray-900 mb-2">写真</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {place.photos.map((photo) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={photo.id}
                        src={photo.baseUrl}
                        alt={photo.filename}
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Brain size={18} />
                クイズに挑戦する
              </button>
            </div>
          )}

          {/* Quiz tab */}
          {activeTab === 'quiz' && (
            <div>
              {!questions && !loadingQuiz && (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🧠</div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {place.name}クイズ
                  </h2>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                    Claude AIが{place.name}に関する5問のクイズを生成します。歴史・文化・豆知識に挑戦！
                  </p>

                  {quizError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
                      {quizError}
                    </div>
                  )}

                  {/* Fallback demo quiz */}
                  <div className="space-y-3">
                    <button
                      onClick={startQuiz}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <Sparkles size={18} />
                      AIクイズを生成する
                    </button>
                    <button
                      onClick={() => setQuestions(getDemoQuestions(place.id))}
                      className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      デモクイズを試す
                    </button>
                  </div>
                </div>
              )}

              {loadingQuiz && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                  <div className="text-center">
                    <p className="font-medium text-gray-900">AIがクイズを生成中...</p>
                    <p className="text-sm text-gray-500 mt-1">{place.name}に関する問題を考えています</p>
                  </div>
                </div>
              )}

              {questions && (
                <QuizGame
                  questions={questions}
                  placeName={place.name}
                  onComplete={handleQuizComplete}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function getDemoQuestions(placeId: string): QuizQuestion[] {
  const demos: Record<string, QuizQuestion[]> = {
    'fushimi-inari': [
      { id: 'q1', question: '伏見稲荷大社が創建されたのは何年ですか？', options: ['538年', '711年', '794年', '1192年'], correctAnswer: 1, explanation: '711年（和銅4年）に稲荷山に祀られたのが始まりとされています。', category: 'history', difficulty: 'medium' },
      { id: 'q2', question: '伏見稲荷大社の鳥居は何本ありますか？', options: ['約3,000本', '約5,000本', '約1万本', '約2万本'], correctAnswer: 2, explanation: '朱塗りの鳥居は約1万本あり、山頂まで続いています。', category: 'trivia', difficulty: 'easy' },
      { id: 'q3', question: '稲荷神社で祀られているのは何の神様ですか？', options: ['火の神', '水の神', '農業・食物・商売の神', '学問の神'], correctAnswer: 2, explanation: '稲荷神は五穀豊穣、商売繁盛、産業発展などのご利益があるとされています。', category: 'culture', difficulty: 'easy' },
      { id: 'q4', question: '稲荷神社の使いとされる動物は？', options: ['鶴', '亀', 'キツネ', '龍'], correctAnswer: 2, explanation: 'キツネ（狐）は稲荷神の使いとされ、白狐が神の使者として境内に多く見られます。', category: 'culture', difficulty: 'easy' },
      { id: 'q5', question: '外国人に最も人気の日本の観光スポットとして有名ですが、山頂までの往復にかかる時間は？', options: ['約30分', '約1時間', '約2〜3時間', '約5時間'], correctAnswer: 2, explanation: '稲荷山山頂（海抜233m）まで往復すると約2〜3時間かかります。', category: 'trivia', difficulty: 'medium' },
    ],
  }
  return demos[placeId] || getGenericQuestions()
}

function getGenericQuestions(): QuizQuestion[] {
  return [
    { id: 'q1', question: 'この場所はどこに位置していますか？', options: ['東北地方', '関東地方', '近畿地方', '九州地方'], correctAnswer: 2, explanation: '近畿地方（関西）に位置しています。', category: 'trivia', difficulty: 'easy' },
    { id: 'q2', question: 'この場所が世界遺産に登録されたのはいつ？', options: ['1993年', '1998年', '2005年', '2013年'], correctAnswer: 1, explanation: '1998年にユネスコ世界文化遺産に登録されました。', category: 'history', difficulty: 'medium' },
    { id: 'q3', question: '年間観光客数は約何人ですか？', options: ['100万人', '500万人', '1000万人', '3000万人'], correctAnswer: 2, explanation: '年間約1000万人の観光客が訪れる人気スポットです。', category: 'trivia', difficulty: 'medium' },
  ]
}
