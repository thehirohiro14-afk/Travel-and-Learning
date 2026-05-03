import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { fetchGooglePhotos } from '@/lib/google-photos'

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const photos = await fetchGooglePhotos(session.accessToken)
    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Failed to fetch Google Photos:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}
