import Anthropic from '@anthropic-ai/sdk'
import type { QuizQuestion } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function generateQuizQuestions(
  placeName: string,
  placeDescription: string,
  count = 5
): Promise<QuizQuestion[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: `あなたは旅行・観光地に関するクイズを作成する専門家です。
指定された場所について、日本語で面白く教育的なクイズを作成してください。
必ず有効なJSONのみを返してください。余分なテキストは不要です。`,
    messages: [
      {
        role: 'user',
        content: `以下の場所について${count}問のクイズを作成してください。

場所名: ${placeName}
説明: ${placeDescription}

以下のJSON配列形式で返してください:
[
  {
    "id": "q1",
    "question": "質問文",
    "options": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    "correctAnswer": 0,
    "explanation": "解説文（100文字程度）",
    "category": "history|culture|food|nature|trivia のいずれか",
    "difficulty": "easy|medium|hard のいずれか"
  }
]

注意事項:
- correctAnswerは0〜3のインデックス
- 選択肢は4つ
- 歴史、文化、豆知識など多様なカテゴリを含める
- 実際の事実に基づいた問題のみ作成
- 面白くて学びになる問題を作成`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON array found in response')

  const questions: QuizQuestion[] = JSON.parse(jsonMatch[0])
  return questions
}

export async function generatePlaceInsight(
  placeName: string,
  placeDescription: string
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `「${placeName}」について、旅行者が知ると旅がさらに楽しくなる豆知識を3〜4文で日本語で教えてください。説明: ${placeDescription}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return content.text
}
