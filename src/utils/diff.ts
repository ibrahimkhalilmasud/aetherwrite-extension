export interface PatchRange {
  start: number
  end: number
  replacement: string
}

export const createMinimalPatch = (source: string, target: string): PatchRange => {
  if (source === target) {
    return { start: 0, end: 0, replacement: "" }
  }

  let prefix = 0
  const minLength = Math.min(source.length, target.length)

  while (prefix < minLength && source[prefix] === target[prefix]) {
    prefix += 1
  }

  let sourceSuffix = source.length
  let targetSuffix = target.length

  while (
    sourceSuffix > prefix &&
    targetSuffix > prefix &&
    source[sourceSuffix - 1] === target[targetSuffix - 1]
  ) {
    sourceSuffix -= 1
    targetSuffix -= 1
  }

  return {
    start: prefix,
    end: sourceSuffix,
    replacement: target.slice(prefix, targetSuffix)
  }
}
