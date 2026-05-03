'use client'

import { useState } from 'react'
import { NavBar } from '@/components/NavBar'
import { MapView } from '@/components/MapView'
import { PlaceCard } from '@/components/PlaceCard'
import { DEMO_PLACES } from '@/lib/demo-data'
import type { PlaceCategory } from '@/lib/types'
import { categoryLabel, categoryColor } from '@/lib/utils'
import { Search } from 'lucide-react'

const CATEGORIES: PlaceCategory[] = [
  'shrine_temple', 'nature', 'food', 'urban', 'museum', 'mountain', 'beach', 'theme_park', 'other',
]

export default function MapPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | null>(null)
  const [view, setView] = useState<'map' | 'list'>('map')

  const filtered = DEMO_PLACES.filter((p) => {
    const matchesQuery =
      !query || p.name.includes(query) || p.address.includes(query) || (p.prefecture || '').includes(query)
    const matchesCategory = !activeCategory || p.category === activeCategory
    return matchesQuery && matchesCategory
  })

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <NavBar />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 space-y-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="場所を検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
              <button
                onClick={() => setView('map')}
                className={`px-3 py-2 ${view === 'map' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                🗺 マップ
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                ☰ リスト
              </button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                !activeCategory
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              すべて ({DEMO_PLACES.length})
            </button>
            {CATEGORIES.filter((c) => DEMO_PLACES.some((p) => p.category === c)).map((cat) => {
              const count = DEMO_PLACES.filter((p) => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : `border-gray-200 ${categoryColor(cat)} hover:border-gray-300`
                  }`}
                >
                  {categoryLabel(cat)} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {view === 'map' ? (
            apiKey ? (
              <MapView places={filtered} apiKey={apiKey} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 p-8">
                <div className="text-5xl">🗺️</div>
                <p className="text-center text-sm">
                  Google Maps を表示するには<br />
                  <code className="bg-gray-100 px-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> を設定してください。
                </p>
                <button onClick={() => setView('list')} className="text-indigo-600 text-sm underline">
                  リスト表示に切り替える
                </button>
              </div>
            )
          ) : (
            <div className="h-full overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>該当する場所が見つかりません</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filtered.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
