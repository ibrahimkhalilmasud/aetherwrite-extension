import type { ToneScore } from "~types"

const toneLexicon: Record<ToneScore["tone"], string[]> = {
  professional: ["regards", "sincerely", "appreciate"],
  friendly: ["thanks", "great", "happy"],
  confident: ["will", "definitely", "clearly"],
  aggressive: ["must", "immediately", "wrong"],
  passive: ["maybe", "perhaps", "possibly"],
  formal: ["therefore", "however", "accordingly"],
  casual: ["hey", "awesome", "cool"]
}

export const detectToneLocally = (text: string): ToneScore[] => {
  const normalized = text.toLowerCase()

  return Object.entries(toneLexicon)
    .map(([tone, markers]) => {
      const hits = markers.filter((marker) => normalized.includes(marker)).length
      const confidence = markers.length === 0 ? 0 : hits / markers.length

      return {
        tone: tone as ToneScore["tone"],
        confidence,
        explanation:
          hits > 0
            ? `Detected ${hits} tone marker${hits > 1 ? "s" : ""}: ${markers.join(", ")}`
            : "No strong markers found"
      }
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
}
