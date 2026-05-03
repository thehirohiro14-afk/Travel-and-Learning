'use client'

import { useSession } from 'next-auth/react'
import { NavBar } from '@/components/NavBar'
import { StatsCard } from '@/components/StatsCard'
import { PlaceCard } from '@/components/PlaceCard'
import { BadgeGrid } from '@/components/BadgeGrid'
import { DEMO_PLACES, DEMO_USER_STATS } from '@/lib/demo-data'
import { categoryLabel } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, Flame, Star } from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()

  const places = DEMO_PLACES
  const stats = DEMO_USER_STATS

  const recentPlaces = [...places]
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 4)

  const unchallenged = places.filter((p) => !p.quizCompleted).slice(0, 3)

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <NavBar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            {session ? `おかえり、${session.user?.name?.split(' ')[0]}さん！` : 'ダッシュボード'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {places.length}か所を訪問済み ·{' '}
            {places.filter((p) => p.quizCompleted).length}か所でクイズクリア
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <StatsCard stats={stats} />

            {/* Quiz challenges */}
            {unchallenged.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame size={18} className="text-orange-500" />
                    <h2 className="font-bold text-gray-900">クイズに挑戦しよう</h2>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {unchallenged.map((place) => (
                    <Link
                      key={place.id}
                      href={`/place/${place.id}#quiz`}
                      className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3.5 hover:shadow-md hover:border-indigo-100 transition-all group"
                    >
                      {place.photos[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={place.photos[0].baseUrl}
                          alt={place.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">{place.name}</div>
                        <div className="text-xs text-gray-500">{categoryLabel(place.category)} · {place.prefecture}</div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                        挑戦する →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Recent places */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-500" />
                  <h2 className="font-bold text-gray-900">最近訪れた場所</h2>
                </div>
                <Link href="/map" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  すべて見る <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recentPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Badges */}
            <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3">獲得バッジ</h2>
              <BadgeGrid earned={stats.badges} />
            </section>

            {/* Category breakdown */}
            <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3">カテゴリ別訪問</h2>
              <div className="space-y-2">
                {Object.entries(
                  places.reduce<Record<string, number>>((acc, p) => {
                    acc[p.category] = (acc[p.category] || 0) + 1
                    return acc
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-2 text-sm">
                      <div className="flex-1 text-gray-700">{categoryLabel(cat as never)}</div>
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(count / places.length) * 100}%` }}
                        />
                      </div>
                      <div className="w-4 text-right text-gray-500 font-medium">{count}</div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
