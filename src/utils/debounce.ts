export const debounce = <T extends (...args: never[]) => void>(
  fn: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let timer: number | null = null

  return (...args: Parameters<T>) => {
    if (timer !== null) {
      window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      fn(...args)
    }, wait)
  }
}
