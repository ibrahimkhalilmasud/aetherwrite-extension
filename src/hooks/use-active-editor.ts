import { useEffect, useState } from "react"

export const useActiveEditor = (): HTMLElement | null => {
  const [editor, setEditor] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const handler = (): void => {
      const active = document.activeElement
      if (active instanceof HTMLElement) {
        setEditor(active)
      }
    }

    document.addEventListener("focusin", handler)
    return () => document.removeEventListener("focusin", handler)
  }, [])

  return editor
}
