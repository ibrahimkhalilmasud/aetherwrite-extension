export class TTLCache<T> {
  private readonly data = new Map<string, { value: T; expires: number }>()

  public constructor(private readonly ttlMs: number) {}

  public get(key: string): T | undefined {
    const found = this.data.get(key)
    if (!found) {
      return undefined
    }

    if (Date.now() > found.expires) {
      this.data.delete(key)
      return undefined
    }

    return found.value
  }

  public set(key: string, value: T): void {
    this.data.set(key, { value, expires: Date.now() + this.ttlMs })
  }

  public clear(): void {
    this.data.clear()
  }
}
