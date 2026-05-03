import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PlaceCategory, UserStats } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function xpForLevel(level: number): number {
  return level * level * 100
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100))
}

export function xpProgressPercent(stats: UserStats): number {
  const currentLevelXp = xpForLevel(stats.level)
  const nextLevelXp = xpForLevel(stats.level + 1)
  const progress = ((stats.totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
  return Math.min(100, Math.max(0, progress))
}

export function quizScoreToXp(score: number, total: number, difficulty: string = 'medium'): number {
  const base = (score / total) * 50
  const multiplier = difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1
  return Math.floor(base * multiplier)
}

export function categoryLabel(cat: PlaceCategory): string {
  const labels: Record<PlaceCategory, string> = {
    shrine_temple: '神社・寺院',
    nature: '自然',
    food: 'グルメ',
    urban: '都市',
    museum: '博物館・美術館',
    theme_park: 'テーマパーク',
    beach: 'ビーチ',
    mountain: '山',
    other: 'その他',
  }
  return labels[cat]
}

export function categoryColor(cat: PlaceCategory): string {
  const colors: Record<PlaceCategory, string> = {
    shrine_temple: 'bg-red-100 text-red-700',
    nature: 'bg-green-100 text-green-700',
    food: 'bg-orange-100 text-orange-700',
    urban: 'bg-blue-100 text-blue-700',
    museum: 'bg-purple-100 text-purple-700',
    theme_park: 'bg-pink-100 text-pink-700',
    beach: 'bg-cyan-100 text-cyan-700',
    mountain: 'bg-emerald-100 text-emerald-700',
    other: 'bg-gray-100 text-gray-700',
  }
  return colors[cat]
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function knowledgeScoreLabel(score: number): string {
  if (score >= 90) return '博士'
  if (score >= 70) return '上級者'
  if (score >= 50) return '中級者'
  if (score >= 30) return '初心者'
  return '未挑戦'
}

export function knowledgeScoreColor(score: number): string {
  if (score >= 90) return 'text-yellow-500'
  if (score >= 70) return 'text-purple-500'
  if (score >= 50) return 'text-blue-500'
  if (score >= 30) return 'text-green-500'
  return 'text-gray-400'
}
