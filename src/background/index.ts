chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get("aetherwrite-settings")
  if (!stored["aetherwrite-settings"]) {
    await chrome.storage.local.set({
      "aetherwrite-settings": {
        apiKey: "",
        enabled: true,
        enableTone: true,
        enableSynonyms: true,
        writingStyle: "balanced",
        blacklistDomains: [],
        customDictionary: []
      }
    })
  }
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "AETHERWRITE_PING") {
    sendResponse({ ok: true, at: Date.now() })
  }

  return true
})
