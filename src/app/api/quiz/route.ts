import { NextRequest, NextResponse } from 'next/server'
import { generateQuizQuestions } from '@/lib/claude'

export async function POST(req: NextRequest) {
  const { placeName, placeDescription, count = 5 } = await req.json()

  if (!placeName) {
    return NextResponse.json({ error: 'placeName is required' }, { status: 400 })
  }

  try {
    const questions = await generateQuizQuestions(placeName, placeDescription || '', count)
    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Quiz generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
