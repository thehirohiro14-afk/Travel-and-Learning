import { NextRequest, NextResponse } from 'next/server'
import { generatePlaceInsight } from '@/lib/claude'

export async function POST(req: NextRequest) {
  const { placeName, placeDescription } = await req.json()

  if (!placeName) {
    return NextResponse.json({ error: 'placeName is required' }, { status: 400 })
  }

  try {
    const insight = await generatePlaceInsight(placeName, placeDescription || '')
    return NextResponse.json({ insight })
  } catch (error) {
    console.error('Insight generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 })
  }
}
