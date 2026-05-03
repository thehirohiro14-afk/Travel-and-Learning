'use client'

import { useSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { NavBar } from '@/components/NavBar'
import type { Photo } from '@/lib/types'
import { Camera, RefreshCw, LogIn } from 'lucide-react'

export default function PhotosPage() {
  const { data: session, status } = useSession()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadPhotos() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/photos')
      if (!res.ok) throw new Error('Failed to load photos')
      const data = await res.json()
      setPhotos(data.photos || [])
    } catch {
      setError('写真の読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!session?.accessToken) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPhotos()
  }, [session?.accessToken])

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <NavBar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Googleフォト連携</h1>
            <p className="text-sm text-gray-500 mt-1">
              写真のメタデータを使って訪問地を自動認識します
            </p>
          </div>
          {session && (
            <button
              onClick={loadPhotos}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              更新
            </button>
          )}
        </div>

        {status === 'loading' && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          </div>
        )}

        {status === 'unauthenticated' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📸</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Googleアカウントでログイン</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Googleフォトの写真を読み込んで、訪問した場所を自動で地図に追加します。
            </p>
            <button
              onClick={() => signIn('google')}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <LogIn size={18} />
              Googleでログイン
            </button>
          </div>
        )}

        {session && (
          <div>
            {/* Connection status */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-green-800">接続済み</div>
                <div className="text-xs text-green-600">{session.user?.email}</div>
              </div>
            </div>

            {/* Note about location data */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-amber-800 mb-1">📍 位置情報について</h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                Google Photos API は2023年以降、位置情報メタデータの返却を制限しています。
                写真の撮影日時と Google マイロケーション履歴を組み合わせることで、より正確な訪問地の特定が可能です。
                現在はデモデータで機能をご確認いただけます。
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
                <span className="ml-3 text-sm text-gray-500">写真を読み込んでいます...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && photos.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Camera size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{photos.length}枚の写真</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {photos.map((photo) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={photo.id}
                      src={`${photo.baseUrl}=w200-h200-c`}
                      alt={photo.filename}
                      className="w-full aspect-square object-cover rounded-lg"
                      title={photo.filename}
                    />
                  ))}
                </div>
              </div>
            )}

            {!loading && !error && photos.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">写真が見つかりませんでした</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
