const manifest = {
  manifest_version: 3,
  name: "AetherWrite",
  description: "Real-time AI writing assistant for grammar, clarity, tone, and rewrites.",
  version: "1.0.0",
  permissions: ["storage", "activeTab", "scripting"],
  host_permissions: [
    "https://api.openai.com/*",
    "https://api.languagetool.org/*",
    "https://api.datamuse.com/*",
    "<all_urls>"
  ],
  icons: {
    "16": "assets/icon16.png",
    "32": "assets/icon32.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  }
}

export default manifest
