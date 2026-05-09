import { describe, expect, it } from "vitest"
import { createSnapshot } from "../../src/ai/pipeline"
import { createMinimalPatch } from "../../src/utils/diff"
import { redactSensitiveText } from "../../src/utils/sanitize"

describe("pipeline snapshot", () => {
  it("extracts sentence around cursor and context window", () => {
    const text = "Hello team. teh update is ready. Please review today."
    const snapshot = createSnapshot(text, 18, 18)

    expect(snapshot.sentence).toBe("teh update is ready.")
    expect(snapshot.contextBefore).toContain("Hello team")
  })
})

describe("minimal patch", () => {
  it("creates a single targeted patch", () => {
    const patch = createMinimalPatch("teh report", "the report")

    expect(patch.start).toBe(1)
    expect(patch.end).toBe(3)
    expect(patch.replacement).toBe("he")
  })
})

describe("sanitize", () => {
  it("redacts emails and card-like values", () => {
    const output = redactSensitiveText("Contact a@b.com with card 4242 4242 4242 4242")

    expect(output).toContain("[REDACTED_EMAIL]")
    expect(output).toContain("[REDACTED_NUMBER]")
  })
})
