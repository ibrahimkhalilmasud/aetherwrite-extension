import { analyzeText, createSnapshot } from "~ai/pipeline"
import { useSettingsStore } from "~stores/settings-store"
import { useSuggestionStore } from "~stores/suggestion-store"
import { debounce } from "~utils/debounce"
import type { Suggestion } from "~types"
import type { EditableElement } from "./editor-detector"
import { getEditorText, getSelectionState, replaceRange } from "./selection-engine"
import { SuggestionOverlay } from "./suggestion-overlay"
import { fetchSynonyms } from "./synonyms"

interface RegisteredEditor {
  onInput: (event: Event) => void
  onFocus: () => void
  onBlur: () => void
  onDoubleClick: () => void
  onKeyDown: (event: Event) => void
}

export class EditorLifecycleManager {
  private readonly editors = new Map<EditableElement, RegisteredEditor>()
  private activeEditor: EditableElement | null = null
  private readonly overlay = new SuggestionOverlay({
    onAccept: (id) => this.applySuggestion(id),
    onReject: (id) => this.rejectSuggestion(id)
  })

  public register(editor: EditableElement): void {
    if (this.editors.has(editor)) {
      return
    }

    const onInput = debounce(() => {
      void this.processEditor(editor)
    }, 300)

    const onFocus = () => {
      this.activeEditor = editor
    }

    const onBlur = () => {
      window.setTimeout(() => this.overlay.hide(), 120)
    }

    const onDoubleClick = () => {
      void this.showSynonyms(editor)
    }

    const onKeyDown = (event: Event) => {
      if (!(event instanceof KeyboardEvent)) {
        return
      }

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "k") {
        window.dispatchEvent(new CustomEvent("aetherwrite:quick-compose", { detail: { editor } }))
      }
    }

    editor.addEventListener("input", onInput)
    editor.addEventListener("focus", onFocus)
    editor.addEventListener("blur", onBlur)
    editor.addEventListener("dblclick", onDoubleClick)
    editor.addEventListener("keydown", onKeyDown)

    this.editors.set(editor, { onInput, onFocus, onBlur, onDoubleClick, onKeyDown })
  }

  public unregister(editor: EditableElement): void {
    const registered = this.editors.get(editor)
    if (!registered) {
      return
    }

    editor.removeEventListener("input", registered.onInput)
    editor.removeEventListener("focus", registered.onFocus)
    editor.removeEventListener("blur", registered.onBlur)
    editor.removeEventListener("dblclick", registered.onDoubleClick)
    editor.removeEventListener("keydown", registered.onKeyDown)

    this.editors.delete(editor)
  }

  public cleanupDetachedEditors(): void {
    for (const editor of this.editors.keys()) {
      if (!editor.isConnected) {
        this.unregister(editor)
      }
    }
  }

  private async processEditor(editor: EditableElement): Promise<void> {
    const settings = useSettingsStore.getState()
    if (settings.blacklistDomains.some((domain) => window.location.hostname.includes(domain))) {
      return
    }

    const text = getEditorText(editor)
    const selection = getSelectionState(editor)
    const snapshot = createSnapshot(text, selection.start, selection.end)
    const result = await analyzeText(snapshot, settings)

    useSuggestionStore.getState().setSuggestions(result.suggestions)
    useSuggestionStore.getState().setTones(result.tones)

    const candidate = result.suggestions[0]
    if (!candidate) {
      this.overlay.hide()
      return
    }

    await this.overlay.show(editor as HTMLElement, candidate, result.tones)
  }

  private applySuggestion(id: string): void {
    if (!this.activeEditor) {
      return
    }

    const store = useSuggestionStore.getState()
    const suggestion = store.suggestions.find((item) => item.id === id)
    if (!suggestion) {
      return
    }

    replaceRange(
      this.activeEditor,
      { start: suggestion.start, end: suggestion.end },
      suggestion.replacement
    )

    store.removeSuggestion(id)
    this.overlay.hide()
  }

  private rejectSuggestion(id: string): void {
    useSuggestionStore.getState().removeSuggestion(id)
    this.overlay.hide()
  }

  private async showSynonyms(editor: EditableElement): Promise<void> {
    const selection = window.getSelection()
    const word = selection?.toString().trim()
    const settings = useSettingsStore.getState()

    if (!word || !settings.enableSynonyms) {
      return
    }

    const synonyms = await fetchSynonyms(word)
    const first = synonyms[0]
    if (!first) {
      return
    }

    const suggestion: Suggestion = {
      id: `synonym-${Date.now()}`,
      kind: "synonym",
      original: word,
      replacement: first.word,
      reason: `${first.definition} (${first.score})`,
      score: 0.7,
      start: getSelectionState(editor).start,
      end: getSelectionState(editor).end
    }

    useSuggestionStore.getState().setSuggestions([suggestion, ...useSuggestionStore.getState().suggestions])
    await this.overlay.show(editor as HTMLElement, suggestion, useSuggestionStore.getState().tones)
  }
}
