import type { Suggestion } from "~types"

const typoMap = new Map<string, string>([
  ["teh", "the"],
  ["recieve", "receive"],
  ["definately", "definitely"],
  ["adress", "address"],
  ["occured", "occurred"]
])

export const detectLocalTypos = (text: string): Suggestion[] => {
  const suggestions: Suggestion[] = []
  const words = text.split(/\b/)
  let index = 0

  for (const token of words) {
    const lower = token.toLowerCase()
    const replacement = typoMap.get(lower)
    if (replacement) {
      suggestions.push({
        id: `local-${index}`,
        kind: "spelling",
        original: token,
        replacement,
        reason: "Common typo",
        score: 0.9,
        start: index,
        end: index + token.length
      })
    }

    index += token.length
  }

  return suggestions
}
