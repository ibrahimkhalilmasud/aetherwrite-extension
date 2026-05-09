import { test, expect } from "@playwright/test"
import path from "node:path"

const fixtureUrl = (fileName: string): string => `file://${path.resolve("tests/fixtures", fileName)}`

test("renders suggestion while typing", async ({ page }) => {
  await page.goto(fixtureUrl("editor.html"))

  await page.locator("#editor").fill("teh")
  await expect(page.locator("#suggestion")).toBeVisible()
})

test("preserves typing and dismisses suggestion with escape", async ({ page }) => {
  await page.goto(fixtureUrl("editor.html"))

  const editor = page.locator("#editor")
  await editor.fill("teh report")
  await page.keyboard.press("Escape")

  await expect(editor).toHaveValue("teh report")
  await expect(page.locator("#suggestion")).toBeHidden()
})
