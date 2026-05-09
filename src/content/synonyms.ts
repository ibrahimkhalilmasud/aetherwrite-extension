const fallbackDictionary: Record<string, string[]> = {
  improve: ["enhance", "refine", "boost"],
  good: ["great", "excellent", "solid"],
  write: ["draft", "compose", "author"]
}

export interface SynonymEntry {
  word: string
  score: number
  definition: string
}

export const fetchSynonyms = async (word: string): Promise<SynonymEntry[]> => {
  const normalized = word.trim().toLowerCase()
  if (!normalized) {
    return []
  }

  try {
    const [synonymsResponse, definitionResponse] = await Promise.all([
      fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(normalized)}&max=8`),
      fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(normalized)}&md=d&max=1`)
    ])

    if (!synonymsResponse.ok || !definitionResponse.ok) {
      throw new Error("Datamuse request failed")
    }

    const synonyms = (await synonymsResponse.json()) as Array<{ word: string; score: number }>
    const definitions = (await definitionResponse.json()) as Array<{ defs?: string[] }>
    const definition = definitions[0]?.defs?.[0] ?? "Definition unavailable"

    return synonyms.map((entry) => ({
      word: entry.word,
      score: entry.score,
      definition
    }))
  } catch {
    const fallback = fallbackDictionary[normalized] ?? []
    return fallback.map((item, index) => ({
      word: item,
      score: Math.max(1, fallback.length - index),
      definition: "Local fallback synonym"
    }))
  }
}
