import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM_PROMPT = `You are a Chinese language expert specialized in HSK5 vocabulary.
Generate learning content to help Japanese speakers master HSK5 words.
Always respond with valid JSON only, no extra text.`

export async function POST(req: NextRequest) {
  const { hanzi, pinyin, meaning, meaningJa } = await req.json()

  if (!hanzi) {
    return NextResponse.json({ error: 'hanzi is required' }, { status: 400 })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate learning content for the HSK5 word: ${hanzi} (${pinyin}) — meaning: ${meaning} / ${meaningJa}

Return this exact JSON structure:
{
  "exampleSentences": [
    { "hanzi": "example sentence", "pinyin": "with pinyin", "meaningJa": "日本語訳" },
    { "hanzi": "example sentence 2", "pinyin": "with pinyin", "meaningJa": "日本語訳" }
  ],
  "culturalNote": "文化的な背景や実際の使われ方（日本語で100字程度）",
  "memoryTip": "覚え方のコツや語呂合わせ（日本語で60字程度）",
  "relatedWords": [
    { "hanzi": "related word", "pinyin": "pinyin", "meaning": "日本語の意味" },
    { "hanzi": "related word 2", "pinyin": "pinyin", "meaning": "日本語の意味" }
  ],
  "xiaohongshuPost": "小红书スタイルの短い投稿文（絵文字多め、中国語で3〜4文、100字以内）"
}`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const insight = JSON.parse(jsonMatch[0])
    return NextResponse.json({ insight })
  } catch (error) {
    console.error('Chinese insight generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 })
  }
}
