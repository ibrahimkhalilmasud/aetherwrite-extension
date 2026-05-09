import type { AnalysisResult, EditorSnapshot, Suggestion, ToneScore } from "~types"
import { suggestionSchema } from "./schemas"

interface OpenAISuggestionPayload {
  kind: Suggestion["kind"]
  original: string
  replacement: string
  reason: string
  score: number
}

interface OpenAIPayload {
  suggestions: OpenAISuggestionPayload[]
  tones: ToneScore[]
}

const endpoint = "https://api.openai.com/v1/responses"

const withTimeout = async (request: Promise<Response>, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await request
    return response
  } finally {
    clearTimeout(timeout)
  }
}

const parseStructuredOutput = async (response: Response): Promise<OpenAIPayload> => {
  const body = (await response.json()) as {
    output?: Array<{ content?: Array<{ text?: string }> }>
  }

  const text = body.output?.[0]?.content?.[0]?.text
  if (!text) {
    return { suggestions: [], tones: [] }
  }

  const parsed = JSON.parse(text) as OpenAIPayload
  return parsed
}

export const analyzeWithOpenAI = async (
  snapshot: EditorSnapshot,
  apiKey: string,
  writingStyle: "balanced" | "concise" | "formal"
): Promise<AnalysisResult> => {
  if (!apiKey.trim()) {
    return { suggestions: [], tones: [] }
  }

  const prompt = [
    "You are a browser writing assistant.",
    `Writing style preference: ${writingStyle}.`,
    "Return only JSON compliant with the provided schema.",
    `Sentence: ${snapshot.sentence}`,
    `Before context: ${snapshot.contextBefore}`,
    `After context: ${snapshot.contextAfter}`
  ].join("\n")

  const requestBody = {
    model: "gpt-5-mini",
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: suggestionSchema.name,
        schema: suggestionSchema.schema,
        strict: true
      }
    }
  }

  const execute = async (): Promise<AnalysisResult> => {
    const response = await withTimeout(
      fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }),
      8000
    )

    if (!response.ok) {
      throw new Error(`OpenAI failed: ${response.status}`)
    }

    const payload = await parseStructuredOutput(response)
    const mapped = payload.suggestions.map((suggestion, index) => {
      const sentenceStart = snapshot.fullText.indexOf(suggestion.original)
      const start = sentenceStart >= 0 ? sentenceStart : snapshot.cursorStart
      const end = start + suggestion.original.length

      return {
        id: `ai-${index}`,
        kind: suggestion.kind,
        original: suggestion.original,
        replacement: suggestion.replacement,
        reason: suggestion.reason,
        score: Math.max(0, Math.min(1, suggestion.score)),
        start,
        end
      }
    })

    return {
      suggestions: mapped,
      tones: payload.tones.map((tone) => ({
        tone: tone.tone,
        confidence: Math.max(0, Math.min(1, tone.confidence)),
        explanation: tone.explanation
      }))
    }
  }

  try {
    return await execute()
  } catch {
    return await execute().catch(() => ({ suggestions: [], tones: [] }))
  }
}

export const generateFromPrompt = async (
  prompt: string,
  apiKey: string,
  style: "email" | "social" | "general"
): Promise<string> => {
  if (!apiKey.trim()) {
    throw new Error("OpenAI API key is required")
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: `Create ${style} writing:\n${prompt}`
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI compose failed: ${response.status}`)
  }

  const payload = (await response.json()) as {
    output_text?: string
    output?: Array<{ content?: Array<{ text?: string }> }>
  }

  return payload.output_text ?? payload.output?.[0]?.content?.[0]?.text ?? ""
}
