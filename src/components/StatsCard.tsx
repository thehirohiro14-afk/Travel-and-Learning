import type { UserStats } from '@/lib/types'
import { levelFromXp, xpForLevel, xpProgressPercent } from '@/lib/utils'
import { MapPin, Camera, Zap, Star } from 'lucide-react'

interface StatsCardProps {
  stats: UserStats
}

export function StatsCard({ stats }: StatsCardProps) {
  const progressPct = xpProgressPercent(stats)
  const nextLevelXp = xpForLevel(stats.level + 1)
  const currentLevelXp = xpForLevel(stats.level)

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
      {/* Level */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-medium opacity-75 mb-0.5">現在のレベル</div>
          <div className="text-3xl font-black">Lv.{stats.level}</div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          {stats.level >= 10 ? '🏆' : stats.level >= 7 ? '⭐' : stats.level >= 4 ? '🌟' : '✨'}
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs opacity-75 mb-1">
          <span>{stats.totalXp - currentLevelXp} XP</span>
          <span>{nextLevelXp - currentLevelXp} XP 必要</span>
        </div>
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { icon: MapPin, value: stats.totalPlaces, label: '場所' },
          { icon: Camera, value: stats.totalPhotos, label: '写真' },
          { icon: Zap, value: stats.totalXp, label: 'XP' },
          { icon: Star, value: stats.badges.length, label: 'バッジ' },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="bg-white/10 rounded-xl py-2">
            <Icon size={14} className="mx-auto mb-1 opacity-75" />
            <div className="text-lg font-bold leading-none">{value}</div>
            <div className="text-xs opacity-60 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
