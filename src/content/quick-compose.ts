import { generateFromPrompt } from "~ai/openai-service"
import { useSettingsStore } from "~stores/settings-store"
import type { EditableElement } from "./editor-detector"
import { getSelectionState, replaceRange } from "./selection-engine"

export class QuickComposeModal {
  private readonly container: HTMLDivElement
  private readonly promptInput: HTMLTextAreaElement
  private readonly submit: HTMLButtonElement
  private readonly closeButton: HTMLButtonElement
  private activeEditor: EditableElement | null = null

  public constructor() {
    this.container = document.createElement("div")
    this.container.style.position = "fixed"
    this.container.style.inset = "0"
    this.container.style.background = "rgba(2,6,23,0.45)"
    this.container.style.display = "none"
    this.container.style.zIndex = "2147483646"

    const card = document.createElement("div")
    card.style.width = "520px"
    card.style.maxWidth = "calc(100vw - 32px)"
    card.style.margin = "10vh auto"
    card.style.background = "#fff"
    card.style.borderRadius = "14px"
    card.style.padding = "16px"
    card.style.fontFamily = "Inter, system-ui, sans-serif"

    this.promptInput = document.createElement("textarea")
    this.promptInput.placeholder = "write apology email, write linkedin post, summarize meeting..."
    this.promptInput.style.width = "100%"
    this.promptInput.style.height = "120px"
    this.promptInput.style.padding = "10px"

    this.submit = document.createElement("button")
    this.submit.textContent = "Generate"
    this.submit.style.marginTop = "10px"
    this.submit.style.padding = "8px 12px"
    this.submit.style.background = "#2563eb"
    this.submit.style.color = "white"
    this.submit.style.borderRadius = "8px"
    this.submit.style.border = "none"

    this.closeButton = document.createElement("button")
    this.closeButton.textContent = "Close"
    this.closeButton.style.marginLeft = "8px"
    this.closeButton.style.padding = "8px 12px"

    card.append(this.promptInput, this.submit, this.closeButton)
    this.container.append(card)
    document.documentElement.append(this.container)

    this.closeButton.addEventListener("click", () => this.hide())
    this.submit.addEventListener("click", () => {
      void this.generate()
    })
  }

  public open(editor: EditableElement): void {
    this.activeEditor = editor
    this.container.style.display = "block"
    this.promptInput.focus()
  }

  public hide(): void {
    this.container.style.display = "none"
    this.promptInput.value = ""
  }

  private async generate(): Promise<void> {
    if (!this.activeEditor) {
      return
    }

    const prompt = this.promptInput.value.trim()
    if (!prompt) {
      return
    }

    const settings = useSettingsStore.getState()
    const style = prompt.toLowerCase().includes("linkedin") ? "social" : prompt.toLowerCase().includes("email") ? "email" : "general"

    this.submit.disabled = true
    this.submit.textContent = "Generating..."

    try {
      const generated = await generateFromPrompt(prompt, settings.apiKey, style)
      const selection = getSelectionState(this.activeEditor)
      replaceRange(this.activeEditor, selection, generated)
      this.hide()
    } finally {
      this.submit.disabled = false
      this.submit.textContent = "Generate"
    }
  }
}
