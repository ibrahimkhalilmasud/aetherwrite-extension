import { analyzeWithOpenAI } from "~ai/openai-service"
import { detectToneLocally } from "~ai/tone-detector"
import { runGrammarAnalysis } from "~grammar"
import type { AnalysisResult, EditorSnapshot, SettingsState, Suggestion } from "~types"
import { TTLCache } from "~utils/cache"
import { redactSensitiveText } from "~utils/sanitize"

const cache = new TTLCache<AnalysisResult>(30_000)
const inflight = new Map<string, Promise<AnalysisResult>>()

const sentenceBounds = (text: string, cursor: number): { start: number; end: number } => {
  const left = text.lastIndexOf(".", Math.max(0, cursor - 1))
  const right = text.indexOf(".", cursor)

  return {
    start: left >= 0 ? left + 1 : 0,
    end: right >= 0 ? right + 1 : text.length
  }
}

export const createSnapshot = (text: string, cursorStart: number, cursorEnd: number): EditorSnapshot => {
  const { start, end } = sentenceBounds(text, cursorStart)
  const sentence = text.slice(start, end).trim()

  return {
    fullText: text,
    sentence,
    contextBefore: text.slice(Math.max(0, start - 120), start),
    contextAfter: text.slice(end, Math.min(text.length, end + 120)),
    cursorStart,
    cursorEnd
  }
}

const mergeSuggestions = (grammar: Suggestion[], ai: Suggestion[]): Suggestion[] => {
  const byKey = new Map<string, Suggestion>()

  for (const item of [...grammar, ...ai]) {
    const key = `${item.start}:${item.end}:${item.replacement}`
    byKey.set(key, item)
  }

  return [...byKey.values()].sort((a, b) => a.start - b.start)
}

export const analyzeText = async (
  snapshot: EditorSnapshot,
  settings: SettingsState
): Promise<AnalysisResult> => {
  if (!settings.enabled) {
    return { suggestions: [], tones: [] }
  }

  const safeSnapshot: EditorSnapshot = {
    ...snapshot,
    sentence: redactSensitiveText(snapshot.sentence),
    contextBefore: redactSensitiveText(snapshot.contextBefore),
    contextAfter: redactSensitiveText(snapshot.contextAfter)
  }

  const key = `${safeSnapshot.sentence}:${settings.writingStyle}`
  const cached = cache.get(key)
  if (cached) {
    return cached
  }

  const existingRequest = inflight.get(key)
  if (existingRequest) {
    return existingRequest
  }

  const request = (async () => {
    const grammar = await runGrammarAnalysis(safeSnapshot.sentence)
    const ai = await analyzeWithOpenAI(safeSnapshot, settings.apiKey, settings.writingStyle)
    const tones = settings.enableTone
      ? ai.tones.length > 0
        ? ai.tones
        : detectToneLocally(safeSnapshot.sentence)
      : []

    const merged: AnalysisResult = {
      suggestions: mergeSuggestions(grammar, ai.suggestions),
      tones
    }

    cache.set(key, merged)
    inflight.delete(key)
    return merged
  })()

  inflight.set(key, request)

  try {
    return await request
  } catch {
    inflight.delete(key)
    return { suggestions: [], tones: detectToneLocally(safeSnapshot.sentence) }
  }
}
