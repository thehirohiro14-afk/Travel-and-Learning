'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { HSK5_WORDS } from '@/lib/hsk5-words'
import type { ChineseWord } from '@/lib/chinese-types'
import { ArrowLeft, RotateCcw, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizQuestion {
  word: ChineseWord
  type: 'hanzi_to_meaning' | 'meaning_to_hanzi'
  options: string[]
  correctIndex: number
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function generateQuiz(count = 10): QuizQuestion[] {
  const words = shuffle(HSK5_WORDS).slice(0, count)
  return words.map((word) => {
    const type: QuizQuestion['type'] = Math.random() > 0.5 ? 'hanzi_to_meaning' : 'meaning_to_hanzi'
    const wrongPool = HSK5_WORDS.filter((w) => w.id !== word.id)
    const wrongs = shuffle(wrongPool).slice(0, 3)

    let correctOption: string
    let wrongOptions: string[]
    if (type === 'hanzi_to_meaning') {
      correctOption = word.meaningJa
      wrongOptions = wrongs.map((w) => w.meaningJa)
    } else {
      correctOption = word.hanzi
      wrongOptions = wrongs.map((w) => w.hanzi)
    }

    const options = shuffle([correctOption, ...wrongOptions])
    const correctIndex = options.indexOf(correctOption)

    return { word, type, options, correctIndex }
  })
}

export default function QuizPage() {
  const questions = useMemo(() => generateQuiz(10), [])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [done, setDone] = useState(false)

  const q = questions[current]

  function select(idx: number) {
    if (selected !== null) return
    setSelected(idx)
  }

  function next() {
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)

    if (current + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrent((c) => c + 1)
    }
  }

  function restart() {
    window.location.reload()
  }

  if (done) {
    const correct = answers.filter((a, i) => a === questions[i].correctIndex).length
    const pct = Math.round((correct / questions.length) * 100)

    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <NavBar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4">
              {pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : '📚'}
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">クイズ結果</h2>
            <div className="text-5xl font-black text-indigo-600 my-4">{pct}%</div>
            <p className="text-gray-500 text-sm mb-6">{questions.length}問中 {correct}問正解</p>

            {/* Review wrong answers */}
            <div className="text-left space-y-2 mb-6">
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.correctIndex
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl text-sm',
                      isCorrect ? 'bg-green-50' : 'bg-red-50'
                    )}
                  >
                    {isCorrect
                      ? <Check size={14} className="text-green-600 flex-shrink-0" />
                      : <X size={14} className="text-red-500 flex-shrink-0" />
                    }
                    <span className="font-bold text-gray-900">{q.word.hanzi}</span>
                    <span className="text-gray-400 text-xs flex-1 truncate">{q.word.meaningJa}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={restart}
                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                <RotateCcw size={16} />
                もう一度挑戦
              </button>
              <Link
                href="/chinese"
                className="flex items-center justify-center w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:shadow-sm transition-all"
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
          <span className="text-sm text-gray-400">{current + 1} / {questions.length}</span>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 text-center">
            <div className="text-xs text-gray-400 mb-3">
              {q.type === 'hanzi_to_meaning' ? '次の単語の意味は？' : '次の意味に当てはまる単語は？'}
            </div>
            {q.type === 'hanzi_to_meaning' ? (
              <div>
                <div className="text-5xl font-bold text-gray-900">{q.word.hanzi}</div>
                <div className="text-indigo-400 mt-2 text-sm">{q.word.pinyin}</div>
              </div>
            ) : (
              <div className="text-xl font-bold text-gray-900 leading-relaxed">{q.word.meaningJa}</div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, idx) => {
              let state: 'default' | 'correct' | 'wrong' = 'default'
              if (selected !== null) {
                if (idx === q.correctIndex) state = 'correct'
                else if (idx === selected) state = 'wrong'
              }

              return (
                <button
                  key={idx}
                  onClick={() => select(idx)}
                  disabled={selected !== null}
                  className={cn(
                    'w-full p-4 rounded-xl text-left font-medium border-2 transition-all',
                    state === 'default' && 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm',
                    state === 'correct' && 'bg-green-50 border-green-400 text-green-800',
                    state === 'wrong' && 'bg-red-50 border-red-400 text-red-800',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                      state === 'default' && 'bg-gray-100 text-gray-500',
                      state === 'correct' && 'bg-green-500 text-white',
                      state === 'wrong' && 'bg-red-500 text-white',
                    )}>
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Explanation after answer */}
          {selected !== null && (
            <div className={cn(
              'mt-4 p-4 rounded-xl text-sm',
              selected === q.correctIndex ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            )}>
              <div className="font-bold mb-1">
                {selected === q.correctIndex ? '正解！' : `不正解 — 正解は「${q.options[q.correctIndex]}」`}
              </div>
              <div className="text-gray-600 text-xs">
                {q.word.hanzi} ({q.word.pinyin}) — {q.word.meaning}
              </div>
            </div>
          )}

          {/* Next button */}
          {selected !== null && (
            <button
              onClick={next}
              className="mt-4 w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              {current + 1 < questions.length ? '次の問題 →' : '結果を見る'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
