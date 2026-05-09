import { useEffect, useMemo, useState } from "react"
import { useSettingsStore } from "~stores/settings-store"

export const SettingsForm = (): JSX.Element => {
  const store = useSettingsStore()
  const [domainInput, setDomainInput] = useState("")
  const [dictionaryInput, setDictionaryInput] = useState("")

  useEffect(() => {
    void store.hydrate()
  }, [store])

  const blacklistValue = useMemo(() => store.blacklistDomains.join(", "), [store.blacklistDomains])

  return (
    <div className="space-y-4 text-slate-800">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">OpenAI API key</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="password"
          value={store.apiKey}
          onChange={(event) => store.setApiKey(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={store.enabled} onChange={(event) => store.setEnabled(event.target.checked)} />
          Assistant enabled
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={store.enableTone}
            onChange={(event) => store.setEnableTone(event.target.checked)}
          />
          Tone analysis
        </label>
        <label className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={store.enableSynonyms}
            onChange={(event) => store.setEnableSynonyms(event.target.checked)}
          />
          Double-click synonyms
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Writing style</label>
        <select
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={store.writingStyle}
          onChange={(event) =>
            store.setWritingStyle(event.target.value as "balanced" | "concise" | "formal")
          }>
          <option value="balanced">Balanced</option>
          <option value="concise">Concise</option>
          <option value="formal">Formal</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Blacklist domains</label>
        <div className="mt-1 flex gap-2">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={domainInput}
            onChange={(event) => setDomainInput(event.target.value)}
            placeholder="example.com"
          />
          <button
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
            onClick={() => {
              const next = domainInput.trim()
              if (!next) {
                return
              }
              store.setBlacklistDomains([...store.blacklistDomains, next])
              setDomainInput("")
            }}>
            Add
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">{blacklistValue || "No blacklisted domains"}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Custom dictionary</label>
        <div className="mt-1 flex gap-2">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={dictionaryInput}
            onChange={(event) => setDictionaryInput(event.target.value)}
            placeholder="organization-specific word"
          />
          <button
            className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
            onClick={() => {
              const next = dictionaryInput.trim()
              if (!next) {
                return
              }
              store.addCustomWord(next)
              setDictionaryInput("")
            }}>
            Add
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white"
          onClick={() => {
            void store.persist()
          }}>
          Save settings
        </button>
        <button
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          onClick={() => {
            void store.clearCache()
          }}>
          Clear local cache
        </button>
      </div>
    </div>
  )
}
