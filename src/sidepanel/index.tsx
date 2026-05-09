import "~styles/globals.css"

import { useState } from "react"
import { generateFromPrompt } from "~ai/openai-service"
import { useSettingsStore } from "~stores/settings-store"

const Sidepanel = (): JSX.Element => {
  const settings = useSettingsStore()
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-lg font-semibold text-slate-900">Quick Compose</h1>
      <p className="mb-3 text-sm text-slate-500">Generate email drafts, social posts, and summaries.</p>
      <textarea
        className="h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="write apology email"
      />
      <button
        className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
        onClick={() => {
          const style = prompt.toLowerCase().includes("linkedin") ? "social" : prompt.toLowerCase().includes("email") ? "email" : "general"

          setLoading(true)
          void generateFromPrompt(prompt, settings.apiKey, style)
            .then((value) => setResult(value))
            .finally(() => setLoading(false))
        }}>
        {loading ? "Generating..." : "Generate"}
      </button>
      <textarea
        className="mt-3 h-52 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        value={result}
        onChange={(event) => setResult(event.target.value)}
      />
    </main>
  )
}

export default Sidepanel
