export type WordCategory =
  | 'daily_life'
  | 'work_business'
  | 'education'
  | 'culture_art'
  | 'society_politics'
  | 'health_body'
  | 'emotion_psychology'
  | 'places_geography'
  | 'nature_environment'
  | 'food_drink'
  | 'technology'
  | 'transportation'

export interface ChineseWord {
  id: string
  hanzi: string
  pinyin: string
  meaning: string
  meaningJa: string
  category: WordCategory
  isPlaceRelated?: boolean
}

export type WordStatus = 'new' | 'learning' | 'review' | 'mastered'

export interface WordProgress {
  wordId: string
  status: WordStatus
  lastReviewed: string
  reviewCount: number
  correctCount: number
}

export interface VocabProgress {
  [wordId: string]: WordProgress
}

export interface VocabInsight {
  exampleSentences: Array<{
    hanzi: string
    pinyin: string
    meaningJa: string
  }>
  culturalNote: string
  memoryTip: string
  relatedWords: Array<{
    hanzi: string
    pinyin: string
    meaning: string
  }>
  xiaohongshuPost: string
}
