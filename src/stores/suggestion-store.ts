import { create } from "zustand"
import type { Suggestion, ToneScore } from "~types"

interface SuggestionState {
  suggestions: Suggestion[]
  tones: ToneScore[]
  selectedSuggestionId: string | null
  setSuggestions: (suggestions: Suggestion[]) => void
  setTones: (tones: ToneScore[]) => void
  selectSuggestion: (id: string | null) => void
  removeSuggestion: (id: string) => void
  clear: () => void
}

export const useSuggestionStore = create<SuggestionState>((set) => ({
  suggestions: [],
  tones: [],
  selectedSuggestionId: null,
  setSuggestions: (suggestions) => set({ suggestions }),
  setTones: (tones) => set({ tones }),
  selectSuggestion: (selectedSuggestionId) => set({ selectedSuggestionId }),
  removeSuggestion: (id) =>
    set((state) => ({
      suggestions: state.suggestions.filter((suggestion) => suggestion.id !== id),
      selectedSuggestionId: state.selectedSuggestionId === id ? null : state.selectedSuggestionId
    })),
  clear: () => set({ suggestions: [], tones: [], selectedSuggestionId: null })
}))
