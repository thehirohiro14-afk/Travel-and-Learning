import Link from 'next/link'
import type { Place } from '@/lib/types'
import { categoryColor, categoryLabel, knowledgeScoreColor, knowledgeScoreLabel } from '@/lib/utils'
import { MapPin, Camera, Star } from 'lucide-react'

interface PlaceCardProps {
  place: Place & { description?: string }
  compact?: boolean
}

export function PlaceCard({ place, compact = false }: PlaceCardProps) {
  const photo = place.photos[0]

  return (
    <Link href={`/place/${place.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        {/* Photo */}
        <div className={`relative bg-gray-100 overflow-hidden ${compact ? 'h-32' : 'h-44'}`}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.baseUrl}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-indigo-50 to-purple-50">
              📍
            </div>
          )}

          {/* Category badge */}
          <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor(place.category)}`}>
            {categoryLabel(place.category)}
          </span>

          {/* Quiz completed badge */}
          {place.quizCompleted && (
            <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              ✓ クリア
            </span>
          )}

          {/* Visit count */}
          {place.visitCount > 1 && (
            <span className="absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">
              {place.visitCount}回訪問
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{place.name}</h3>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin size={11} />
            <span className="truncate">{place.prefecture || place.country}</span>
          </div>

          {!compact && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-500">
                <Camera size={11} />
                <span>{place.photos.length}枚</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={11} className={knowledgeScoreColor(place.knowledgeScore)} />
                <span className={`font-semibold ${knowledgeScoreColor(place.knowledgeScore)}`}>
                  {knowledgeScoreLabel(place.knowledgeScore)}
                </span>
              </div>
            </div>
          )}

          {/* Knowledge score bar */}
          {!compact && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${place.knowledgeScore}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
