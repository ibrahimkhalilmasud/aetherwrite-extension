export const suggestionSchema = {
  name: "aetherwrite_suggestions",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      suggestions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            kind: {
              type: "string",
              enum: [
                "grammar",
                "spelling",
                "punctuation",
                "clarity",
                "conciseness",
                "tone",
                "rewrite"
              ]
            },
            original: { type: "string" },
            replacement: { type: "string" },
            reason: { type: "string" },
            score: { type: "number" }
          },
          required: ["kind", "original", "replacement", "reason", "score"]
        }
      },
      tones: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            tone: {
              type: "string",
              enum: ["professional", "friendly", "confident", "aggressive", "passive", "formal", "casual"]
            },
            confidence: { type: "number" },
            explanation: { type: "string" }
          },
          required: ["tone", "confidence", "explanation"]
        }
      }
    },
    required: ["suggestions", "tones"]
  },
  strict: true
} as const
