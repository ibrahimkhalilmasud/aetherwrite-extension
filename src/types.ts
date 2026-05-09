export type SuggestionKind =
  | "grammar"
  | "spelling"
  | "punctuation"
  | "clarity"
  | "conciseness"
  | "tone"
  | "rewrite"
  | "synonym"

export interface Suggestion {
  id: string
  kind: SuggestionKind
  original: string
  replacement: string
  reason: string
  score: number
  start: number
  end: number
}

export type ToneLabel =
  | "professional"
  | "friendly"
  | "confident"
  | "aggressive"
  | "passive"
  | "formal"
  | "casual"

export interface ToneScore {
  tone: ToneLabel
  confidence: number
  explanation: string
}

export interface AnalysisResult {
  suggestions: Suggestion[]
  tones: ToneScore[]
}

export interface EditorSnapshot {
  fullText: string
  sentence: string
  contextBefore: string
  contextAfter: string
  cursorStart: number
  cursorEnd: number
}

export interface SettingsState {
  apiKey: string
  enabled: boolean
  enableTone: boolean
  enableSynonyms: boolean
  writingStyle: "balanced" | "concise" | "formal"
  blacklistDomains: string[]
  customDictionary: string[]
}
