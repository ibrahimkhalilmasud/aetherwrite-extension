import type { EditableElement } from "./editor-detector"

export interface SelectionState {
  start: number
  end: number
}

export const getEditorText = (editor: EditableElement): string => {
  if (editor instanceof HTMLInputElement || editor instanceof HTMLTextAreaElement) {
    return editor.value
  }

  return editor.innerText
}

export const setEditorText = (editor: EditableElement, value: string): void => {
  if (editor instanceof HTMLInputElement || editor instanceof HTMLTextAreaElement) {
    editor.value = value
    return
  }

  editor.innerText = value
}

export const getSelectionState = (editor: EditableElement): SelectionState => {
  if (editor instanceof HTMLInputElement || editor instanceof HTMLTextAreaElement) {
    return {
      start: editor.selectionStart ?? editor.value.length,
      end: editor.selectionEnd ?? editor.value.length
    }
  }

  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    const length = getEditorText(editor).length
    return { start: length, end: length }
  }

  const range = selection.getRangeAt(0)
  const preRange = range.cloneRange()
  preRange.selectNodeContents(editor)
  preRange.setEnd(range.startContainer, range.startOffset)

  const start = preRange.toString().length
  const selectedLength = range.toString().length

  return { start, end: start + selectedLength }
}

export const restoreSelection = (editor: EditableElement, target: SelectionState): void => {
  if (editor instanceof HTMLInputElement || editor instanceof HTMLTextAreaElement) {
    editor.setSelectionRange(target.start, target.end)
    return
  }

  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT)
  let count = 0
  let startNode: Node | null = null
  let endNode: Node | null = null
  let startOffset = 0
  let endOffset = 0

  while (walker.nextNode()) {
    const textNode = walker.currentNode
    const text = textNode.textContent ?? ""
    const nextCount = count + text.length

    if (!startNode && target.start <= nextCount) {
      startNode = textNode
      startOffset = Math.max(0, target.start - count)
    }

    if (!endNode && target.end <= nextCount) {
      endNode = textNode
      endOffset = Math.max(0, target.end - count)
      break
    }

    count = nextCount
  }

  if (!startNode || !endNode) {
    return
  }

  const range = document.createRange()
  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset)

  const selection = window.getSelection()
  if (!selection) {
    return
  }

  selection.removeAllRanges()
  selection.addRange(range)
}

export const replaceRange = (
  editor: EditableElement,
  range: SelectionState,
  replacement: string
): SelectionState => {
  const text = getEditorText(editor)
  const next = text.slice(0, range.start) + replacement + text.slice(range.end)
  setEditorText(editor, next)

  const cursor = range.start + replacement.length
  const state = { start: cursor, end: cursor }
  restoreSelection(editor, state)
  return state
}
