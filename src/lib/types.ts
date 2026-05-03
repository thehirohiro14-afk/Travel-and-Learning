export interface Photo {
  id: string
  baseUrl: string
  filename: string
  creationTime: string
  mimeType: string
  lat?: number
  lng?: number
}

export interface Place {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  photos: Photo[]
  firstVisit: string
  lastVisit: string
  visitCount: number
  knowledgeScore: number
  quizCompleted: boolean
  category: PlaceCategory
  country: string
  prefecture?: string
}

export type PlaceCategory =
  | 'shrine_temple'
  | 'nature'
  | 'food'
  | 'urban'
  | 'museum'
  | 'theme_park'
  | 'beach'
  | 'mountain'
  | 'other'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: 'history' | 'culture' | 'food' | 'nature' | 'trivia'
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuizResult {
  placeId: string
  score: number
  total: number
  earnedXp: number
  answers: number[]
}

export interface UserStats {
  totalPlaces: number
  totalPhotos: number
  totalXp: number
  level: number
  badges: Badge[]
  quizzesTaken: number
  correctAnswers: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt?: string
}

export interface GooglePhotosAlbum {
  id: string
  title: string
  productUrl: string
  mediaItemsCount: string
  coverPhotoBaseUrl?: string
}

export interface DemoPlace extends Place {
  description: string
  funFacts: string[]
}
