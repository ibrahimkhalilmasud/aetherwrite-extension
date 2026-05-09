import { isEditorSafe } from "./security"

export type EditableElement = HTMLTextAreaElement | HTMLInputElement | HTMLElement

const selector = [
  "textarea",
  "input[type='text']",
  "input[type='email']",
  "input[type='search']",
  "input[type='url']",
  "input[type='tel']",
  "[contenteditable='true']",
  "[contenteditable='']",
  "[role='textbox']"
].join(",")

export const discoverEditors = (root: ParentNode = document): EditableElement[] => {
  const nodes = [...root.querySelectorAll<HTMLElement>(selector)]

  return nodes.filter((node): node is EditableElement => {
    if (!node.isConnected || node.getAttribute("aria-hidden") === "true") {
      return false
    }

    return isEditorSafe(node)
  })
}
