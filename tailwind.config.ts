import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        grammar: "#ef4444",
        clarity: "#3b82f6",
        tone: "#10b981"
      }
    }
  },
  plugins: []
} satisfies Config
