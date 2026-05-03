import type { Photo, Place, PlaceCategory } from './types'

interface MediaItem {
  id: string
  baseUrl: string
  filename: string
  mimeType: string
  mediaMetadata: {
    creationTime: string
    width: string
    height: string
    photo?: {
      cameraMake?: string
      cameraModel?: string
      focalLength?: number
      apertureFNumber?: number
      isoEquivalent?: number
    }
  }
}

interface MediaItemsResponse {
  mediaItems: MediaItem[]
  nextPageToken?: string
}

export async function fetchGooglePhotos(accessToken: string, pageSize = 50): Promise<Photo[]> {
  const res = await fetch(
    `https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=${pageSize}&filters=%7B%22mediaTypeFilter%22%3A%7B%22mediaTypes%22%3A%5B%22PHOTO%22%5D%7D%7D`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  if (!res.ok) {
    throw new Error(`Google Photos API error: ${res.status}`)
  }

  const data: MediaItemsResponse = await res.json()
  const items = data.mediaItems || []

  return items.map((item) => ({
    id: item.id,
    baseUrl: item.baseUrl,
    filename: item.filename,
    creationTime: item.mediaMetadata.creationTime,
    mimeType: item.mimeType,
  }))
}

// Google Photos API no longer returns location data.
// This function attempts to reverse-geocode based on album names or exif when available.
export async function groupPhotosByLocation(
  photos: Photo[],
  geocodeApiKey: string
): Promise<Place[]> {
  // In a real implementation, location data would come from:
  // 1. Google Maps Timeline export
  // 2. EXIF GPS data embedded in photos (not exposed by Photos API)
  // 3. Manual tagging by user
  // For this demo, we return an empty array — use demo mode instead.
  return []
}

export function inferCategoryFromName(name: string): PlaceCategory {
  const lower = name.toLowerCase()
  if (/shrine|temple|神社|寺|稲荷|東照宮/.test(lower)) return 'shrine_temple'
  if (/mountain|山|富士|fuji|alps/.test(lower)) return 'mountain'
  if (/beach|海|island|島|沖縄/.test(lower)) return 'beach'
  if (/park|forest|bamboo|竹|自然|nature/.test(lower)) return 'nature'
  if (/museum|memorial|castle|城|palace/.test(lower)) return 'museum'
  if (/food|グルメ|道頓堀|tsukiji|築地/.test(lower)) return 'food'
  if (/disneyland|usp|theme|遊園地/.test(lower)) return 'theme_park'
  if (/tokyo|osaka|shibuya|shinjuku|都市/.test(lower)) return 'urban'
  return 'other'
}
