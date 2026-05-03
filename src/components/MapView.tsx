'use client'

import { useState } from 'react'
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import type { Place } from '@/lib/types'
import { categoryColor, categoryLabel, formatDate } from '@/lib/utils'
import { knowledgeScoreLabel, knowledgeScoreColor } from '@/lib/utils'
import Link from 'next/link'

interface MapViewProps {
  places: Place[]
  apiKey: string
}

export function MapView({ places, apiKey }: MapViewProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const center = places.length > 0
    ? { lat: places[0].lat, lng: places[0].lng }
    : { lat: 36.5, lng: 136.0 }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId="travel-map"
        defaultCenter={center}
        defaultZoom={5}
        className="w-full h-full"
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {places.map((place) => (
          <AdvancedMarker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => setSelectedPlace(place)}
          >
            <div className="relative cursor-pointer group">
              <div
                className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg transition-transform group-hover:scale-110 ${
                  place.quizCompleted ? 'bg-indigo-500' : 'bg-gray-400'
                }`}
              >
                {place.category === 'shrine_temple' && '⛩️'}
                {place.category === 'mountain' && '🗻'}
                {place.category === 'beach' && '🏖️'}
                {place.category === 'nature' && '🌿'}
                {place.category === 'museum' && '🏛️'}
                {place.category === 'food' && '🍜'}
                {place.category === 'theme_park' && '🎡'}
                {place.category === 'urban' && '🏙️'}
                {place.category === 'other' && '📍'}
              </div>
              {place.visitCount > 1 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-400 text-white text-xs flex items-center justify-center font-bold">
                  {place.visitCount}
                </div>
              )}
            </div>
          </AdvancedMarker>
        ))}

        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-1 max-w-xs">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-sm leading-tight">
                  {selectedPlace.name}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${categoryColor(selectedPlace.category)}`}>
                  {categoryLabel(selectedPlace.category)}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-2">{selectedPlace.address}</p>

              <div className="flex items-center gap-3 text-xs mb-3">
                <span className="text-gray-600">📅 {formatDate(selectedPlace.lastVisit)}</span>
                <span className={`font-semibold ${knowledgeScoreColor(selectedPlace.knowledgeScore)}`}>
                  {knowledgeScoreLabel(selectedPlace.knowledgeScore)}
                </span>
              </div>

              {selectedPlace.photos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedPlace.photos[0].baseUrl}
                  alt={selectedPlace.name}
                  className="w-full h-24 object-cover rounded mb-2"
                />
              )}

              <Link
                href={`/place/${selectedPlace.id}`}
                className="block w-full text-center text-xs font-semibold py-1.5 px-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                詳細・クイズへ →
              </Link>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  )
}
