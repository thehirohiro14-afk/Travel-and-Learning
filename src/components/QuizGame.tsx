'use client'

import { useState } from 'react'
import type { QuizQuestion } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react'

interface QuizGameProps {
  questions: QuizQuestion[]
  placeName: string
  onComplete: (score: number, total: number) => void
}

type Phase = 'question' | 'result' | 'summary'

export function QuizGame({ questions, placeName, onComplete }: QuizGameProps) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('question')

  const question = questions[current]
  const correctCount = answers.filter((a, i) => a === questions[i].correctAnswer).length

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    setPhase('result')
  }

  function handleNext() {
    const newAnswers = [...answers, selected!]
    setAnswers(newAnswers)
    setSelected(null)

    if (current + 1 >= questions.length) {
      const score = newAnswers.filter((a, i) => a === questions[i].correctAnswer).length
      onComplete(score, questions.length)
      setPhase('summary')
    } else {
      setCurrent(current + 1)
      setPhase('question')
    }
  }

  function handleRetry() {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setPhase('question')
  }

  if (phase === 'summary') {
    const percentage = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="text-center py-8 px-4">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : percentage >= 40 ? '😊' : '📚'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">クイズ完了！</h2>
        <p className="text-gray-500 mb-6">{placeName}についてのクイズ結果</p>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 inline-block min-w-[200px]">
          <div className="text-5xl font-black text-indigo-600 mb-1">
            {correctCount}<span className="text-2xl text-gray-400">/{questions.length}</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">{percentage}%</div>
          <div className="text-sm text-gray-500 mt-1">
            {percentage >= 80 ? 'すばらしい！' : percentage >= 60 ? 'よくできました！' : 'もう一度挑戦してみよう'}
          </div>
        </div>

        <div className="space-y-2 text-sm text-left max-w-sm mx-auto mb-6">
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctAnswer
            return (
              <div key={q.id} className={cn('flex items-start gap-2 p-2 rounded-lg', isCorrect ? 'bg-green-50' : 'bg-red-50')}>
                {isCorrect ? (
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <span className={isCorrect ? 'text-green-800' : 'text-red-800'}>{q.question}</span>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            もう一度
          </button>
        </div>
      </div>
    )
  }

  const isCorrect = selected === question.correctAnswer

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>問題 {current + 1} / {questions.length}</span>
          <span className="capitalize">{question.difficulty === 'hard' ? '難' : question.difficulty === 'medium' ? '中' : '易'}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 mb-4 text-white">
        <div className="text-xs font-medium opacity-75 mb-2 uppercase tracking-wide">
          {question.category === 'history' ? '歴史' : question.category === 'culture' ? '文化' : question.category === 'food' ? '食' : question.category === 'nature' ? '自然' : '豆知識'}
        </div>
        <p className="text-base font-semibold leading-relaxed">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-4">
        {question.options.map((option, idx) => {
          let style = 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
          if (selected !== null) {
            if (idx === question.correctAnswer) {
              style = 'border-green-400 bg-green-50'
            } else if (idx === selected && !isCorrect) {
              style = 'border-red-400 bg-red-50'
            } else {
              style = 'border-gray-100 bg-gray-50 opacity-60'
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150',
                style,
                selected === null && 'cursor-pointer active:scale-[0.99]'
              )}
            >
              <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold text-center leading-6 mr-2 flex-shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {selected !== null && (
        <div className={cn('rounded-xl p-4 mb-4', isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200')}>
          <div className="flex items-center gap-2 mb-1.5">
            {isCorrect ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <XCircle size={16} className="text-orange-500" />
            )}
            <span className={`text-sm font-bold ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
              {isCorrect ? '正解！🎉' : `不正解 — 正解は「${question.options[question.correctAnswer]}」`}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          {current + 1 >= questions.length ? (
            <>
              <Trophy size={18} />
              結果を見る
            </>
          ) : (
            <>
              次の問題へ
              <ArrowRight size={18} />
            </>
          )}
        </button>
      )}
    </div>
  )
}
