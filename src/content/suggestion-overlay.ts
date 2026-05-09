import { computePosition, flip, offset, shift } from "@floating-ui/dom"
import type { Suggestion, ToneScore } from "~types"

interface OverlayHandlers {
  onAccept: (suggestionId: string) => void
  onReject: (suggestionId: string) => void
}

const colorByKind: Record<Suggestion["kind"], string> = {
  grammar: "#ef4444",
  spelling: "#ef4444",
  punctuation: "#ef4444",
  clarity: "#3b82f6",
  conciseness: "#3b82f6",
  tone: "#10b981",
  rewrite: "#3b82f6",
  synonym: "#10b981"
}

export class SuggestionOverlay {
  private readonly root: HTMLDivElement
  private readonly shadow: ShadowRoot
  private readonly panel: HTMLDivElement
  private activeSuggestionId: string | null = null

  public constructor(private readonly handlers: OverlayHandlers) {
    this.root = document.createElement("div")
    this.root.style.position = "fixed"
    this.root.style.left = "0"
    this.root.style.top = "0"
    this.root.style.zIndex = "2147483647"

    this.shadow = this.root.attachShadow({ mode: "open" })
    this.panel = document.createElement("div")
    this.panel.style.display = "none"
    this.panel.style.minWidth = "260px"
    this.panel.style.maxWidth = "360px"
    this.panel.style.background = "white"
    this.panel.style.border = "1px solid #e5e7eb"
    this.panel.style.borderRadius = "12px"
    this.panel.style.padding = "10px"
    this.panel.style.boxShadow = "0 12px 24px rgba(15,23,42,0.15)"
    this.panel.style.fontFamily = "Inter, system-ui, sans-serif"

    this.shadow.append(this.panel)
    document.documentElement.append(this.root)

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.hide()
      }

      if (event.key === "Enter" && event.altKey && this.activeSuggestionId) {
        this.handlers.onAccept(this.activeSuggestionId)
      }
    })
  }

  public async show(
    target: HTMLElement,
    suggestion: Suggestion,
    tones: ToneScore[],
    isVisible = true
  ): Promise<void> {
    this.activeSuggestionId = suggestion.id
    this.panel.innerHTML = ""

    const heading = document.createElement("div")
    heading.textContent = suggestion.kind.toUpperCase()
    heading.style.color = colorByKind[suggestion.kind]
    heading.style.fontSize = "12px"
    heading.style.fontWeight = "700"

    const diff = document.createElement("div")
    diff.style.marginTop = "8px"
    diff.innerHTML = `<strong>${escapeHtml(suggestion.original)}</strong> → ${escapeHtml(suggestion.replacement)}`

    const reason = document.createElement("div")
    reason.style.marginTop = "6px"
    reason.style.fontSize = "13px"
    reason.style.color = "#475569"
    reason.textContent = suggestion.reason

    const tone = document.createElement("div")
    tone.style.marginTop = "8px"
    tone.style.fontSize = "12px"
    tone.style.color = "#0f766e"
    tone.textContent = tones
      .map((item) => `${item.tone}: ${Math.round(item.confidence * 100)}%`)
      .join(" • ")

    const actions = document.createElement("div")
    actions.style.display = "flex"
    actions.style.gap = "8px"
    actions.style.marginTop = "10px"

    const accept = document.createElement("button")
    accept.textContent = "Accept"
    accept.style.flex = "1"
    accept.style.padding = "6px 10px"
    accept.style.background = "#2563eb"
    accept.style.color = "white"
    accept.style.border = "none"
    accept.style.borderRadius = "8px"
    accept.addEventListener("click", () => this.handlers.onAccept(suggestion.id))

    const reject = document.createElement("button")
    reject.textContent = "Dismiss"
    reject.style.flex = "1"
    reject.style.padding = "6px 10px"
    reject.style.background = "#f8fafc"
    reject.style.color = "#334155"
    reject.style.border = "1px solid #cbd5e1"
    reject.style.borderRadius = "8px"
    reject.addEventListener("click", () => this.handlers.onReject(suggestion.id))

    actions.append(accept, reject)
    this.panel.append(heading, diff, reason)
    if (tone.textContent) {
      this.panel.append(tone)
    }
    this.panel.append(actions)

    if (!isVisible) {
      this.hide()
      return
    }

    this.panel.style.display = "block"

    const position = await computePosition(target, this.root, {
      placement: "bottom-start",
      middleware: [offset(8), flip(), shift({ padding: 8 })]
    })

    this.root.style.left = `${position.x}px`
    this.root.style.top = `${position.y}px`

    target.style.textDecorationColor = colorByKind[suggestion.kind]
    target.style.textDecorationLine = "underline"
    target.style.textDecorationStyle = "wavy"
  }

  public hide(): void {
    this.panel.style.display = "none"
    this.activeSuggestionId = null
  }
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
