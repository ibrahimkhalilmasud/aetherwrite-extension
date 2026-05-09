import { isSensitiveDomain } from "~utils/domains"

const blockedInputTypes = new Set(["password", "number"])

export const isEditorSafe = (element: HTMLElement): boolean => {
  if (isSensitiveDomain(window.location.hostname)) {
    return false
  }

  if (element instanceof HTMLInputElement && blockedInputTypes.has(element.type.toLowerCase())) {
    return false
  }

  const nearestForm = element.closest("form")
  const hints = nearestForm?.textContent?.toLowerCase() ?? ""
  if (hints.includes("card") || hints.includes("payment") || hints.includes("cvv")) {
    return false
  }

  return true
}
