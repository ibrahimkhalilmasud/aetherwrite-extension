import type { Suggestion } from "~types"

interface LanguageToolMatch {
  offset: number
  length: number
  replacements: Array<{ value: string }>
  message: string
  rule: { id: string; category: { id: string } }
}

interface LanguageToolResponse {
  matches: LanguageToolMatch[]
}

const categoryToKind = (category: string): Suggestion["kind"] => {
  if (category.includes("PUNCTUATION")) {
    return "punctuation"
  }

  if (category.includes("GRAMMAR")) {
    return "grammar"
  }

  return "spelling"
}

export const fetchLanguageToolSuggestions = async (text: string): Promise<Suggestion[]> => {
  const body = new URLSearchParams({ text, language: "en-US", enabledOnly: "false" })

  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  })

  if (!response.ok) {
    throw new Error(`LanguageTool failed: ${response.status}`)
  }

  const payload = (await response.json()) as LanguageToolResponse

  return payload.matches
    .filter((match) => match.replacements.length > 0)
    .map((match, index) => {
      const [firstReplacement] = match.replacements
      if (!firstReplacement) {
        return null
      }

      return {
        id: `lt-${index}-${match.rule.id}`,
        kind: categoryToKind(match.rule.category.id),
        original: text.slice(match.offset, match.offset + match.length),
        replacement: firstReplacement.value,
        reason: match.message,
        score: 0.85,
        start: match.offset,
        end: match.offset + match.length
      }
    })
    .filter((match): match is Suggestion => match !== null)
}
