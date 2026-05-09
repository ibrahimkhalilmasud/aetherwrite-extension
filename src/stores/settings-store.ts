import { create } from "zustand"
import type { SettingsState } from "~types"

interface SettingsStore extends SettingsState {
  setApiKey: (apiKey: string) => void
  setEnabled: (enabled: boolean) => void
  setEnableTone: (enableTone: boolean) => void
  setEnableSynonyms: (enableSynonyms: boolean) => void
  setWritingStyle: (style: SettingsState["writingStyle"]) => void
  setBlacklistDomains: (domains: string[]) => void
  addCustomWord: (word: string) => void
  clearCache: () => Promise<void>
  hydrate: () => Promise<void>
  persist: () => Promise<void>
}

const initialState: SettingsState = {
  apiKey: "",
  enabled: true,
  enableTone: true,
  enableSynonyms: true,
  writingStyle: "balanced",
  blacklistDomains: [],
  customDictionary: []
}

const storageKey = "aetherwrite-settings"

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...initialState,
  setApiKey: (apiKey) => set({ apiKey }),
  setEnabled: (enabled) => set({ enabled }),
  setEnableTone: (enableTone) => set({ enableTone }),
  setEnableSynonyms: (enableSynonyms) => set({ enableSynonyms }),
  setWritingStyle: (writingStyle) => set({ writingStyle }),
  setBlacklistDomains: (blacklistDomains) => set({ blacklistDomains }),
  addCustomWord: (word) =>
    set((state) => ({
      customDictionary: state.customDictionary.includes(word)
        ? state.customDictionary
        : [...state.customDictionary, word]
    })),
  clearCache: async () => {
    await chrome.storage.local.remove("aetherwrite-cache")
  },
  hydrate: async () => {
    const payload = await chrome.storage.local.get(storageKey)
    const stored = payload[storageKey] as Partial<SettingsState> | undefined
    if (stored) {
      set({ ...initialState, ...stored })
    }
  },
  persist: async () => {
    const snapshot = get()
    const state: SettingsState = {
      apiKey: snapshot.apiKey,
      enabled: snapshot.enabled,
      enableTone: snapshot.enableTone,
      enableSynonyms: snapshot.enableSynonyms,
      writingStyle: snapshot.writingStyle,
      blacklistDomains: snapshot.blacklistDomains,
      customDictionary: snapshot.customDictionary
    }

    await chrome.storage.local.set({ [storageKey]: state })
  }
}))
