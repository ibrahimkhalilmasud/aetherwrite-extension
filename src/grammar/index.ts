import type { Suggestion } from "~types"
import { fetchLanguageToolSuggestions } from "./languagetool"
import { detectLocalTypos } from "./local-typo"

export const runGrammarAnalysis = async (text: string): Promise<Suggestion[]> => {
  const local = detectLocalTypos(text)

  try {
    const remote = await fetchLanguageToolSuggestions(text)
    return [...remote, ...local]
  } catch {
    return local
  }
}
