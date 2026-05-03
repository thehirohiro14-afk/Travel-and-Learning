'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { MapPin, Camera, Brain, Trophy } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'Googleフォトと連携',
    description: '撮影した写真のメタデータを解析し、訪れた場所を自動で認識します。',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: MapPin,
    title: '訪問地マップ',
    description: '行ったことのある場所をインタラクティブな地図上でひと目で確認できます。',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Brain,
    title: 'AI知識クイズ',
    description: 'Claude AIがその場所に特化したクイズを生成。歴史・文化・グルメを楽しく学べます。',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Trophy,
    title: 'ゲーム感覚で成長',
    description: 'XPを獲得してレベルアップ。バッジを集めてお出かけをもっと楽しく。',
    color: 'bg-yellow-100 text-yellow-600',
  },
]

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white text-3xl mb-4 shadow-lg">
            🗺️
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            旅と学び
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-md mx-auto leading-relaxed">
            Googleフォトの写真履歴から<br />
            行った場所を可視化し、<br />
            ゲーム感覚で知識を深めよう
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Googleでログイン
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            デモを見る →
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="bg-white rounded-2xl p-5 text-left border border-gray-100 shadow-sm">
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        © 2025 旅と学び — Powered by Claude AI & Google Photos
      </footer>
    </div>
  )
}
