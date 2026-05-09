import type { PlasmoCSConfig } from "plasmo"
import { useSettingsStore } from "~stores/settings-store"
import { discoverEditors } from "~content/editor-detector"
import { EditorLifecycleManager } from "~content/editor-lifecycle"
import { QuickComposeModal } from "~content/quick-compose"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle"
}

const manager = new EditorLifecycleManager()
const quickCompose = new QuickComposeModal()

const syncEditors = (): void => {
  for (const editor of discoverEditors()) {
    manager.register(editor)
  }

  manager.cleanupDetachedEditors()
}

const boot = async (): Promise<void> => {
  await useSettingsStore.getState().hydrate()
  syncEditors()

  const observer = new MutationObserver(() => syncEditors())
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["contenteditable"]
  })

  window.addEventListener("aetherwrite:quick-compose", (event) => {
    const payload = event as CustomEvent<{ editor?: HTMLElement }>
    const editor = payload.detail.editor
    if (editor) {
      quickCompose.open(editor)
    }
  })
}

void boot()
