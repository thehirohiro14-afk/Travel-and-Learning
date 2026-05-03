import type { Badge } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Lock } from 'lucide-react'

const ALL_BADGES: (Badge & { locked?: boolean })[] = [
  { id: 'first-quiz', name: '初クイズクリア', description: '初めてクイズをクリアした', icon: '🎯' },
  { id: 'kyoto-lover', name: '京都好き', description: '京都の場所を2か所以上訪問', icon: '⛩️' },
  { id: 'mountain-climber', name: '登山家', description: '山のカテゴリを訪問', icon: '🗻' },
  { id: 'quiz-master', name: 'クイズマスター', description: 'クイズで90点以上を獲得', icon: '🏆' },
  { id: 'explorer', name: '探検家', description: '5か所以上を訪問', icon: '🧭' },
  { id: 'history-buff', name: '歴史好き', description: '歴史カテゴリを10問正解', icon: '📜' },
  { id: 'foodie', name: 'グルメ通', description: 'グルメカテゴリを3か所訪問', icon: '🍜' },
  { id: 'world-traveler', name: '世界旅行者', description: '2か国以上を訪問', icon: '🌍' },
]

interface BadgeGridProps {
  earned: Badge[]
}

export function BadgeGrid({ earned }: BadgeGridProps) {
  const earnedIds = new Set(earned.map((b) => b.id))

  return (
    <div className="grid grid-cols-4 gap-3">
      {ALL_BADGES.map((badge) => {
        const isEarned = earnedIds.has(badge.id)
        const earnedBadge = earned.find((b) => b.id === badge.id)

        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
              isEarned
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-gray-100 bg-gray-50 opacity-50'
            }`}
            title={badge.description}
          >
            <div className="relative text-2xl mb-1">
              {isEarned ? badge.icon : <Lock size={20} className="text-gray-400" />}
            </div>
            <div className={`text-xs font-medium leading-tight ${isEarned ? 'text-gray-900' : 'text-gray-400'}`}>
              {badge.name}
            </div>
            {isEarned && earnedBadge?.earnedAt && (
              <div className="text-xs text-gray-400 mt-0.5">
                {formatDate(earnedBadge.earnedAt)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
