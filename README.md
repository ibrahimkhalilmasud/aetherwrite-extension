# AetherWrite Extension

A production-grade Manifest V3 AI writing assistant browser extension for Brave/Chrome/Edge.

## Features

- Real-time editor detection for textarea, text input, and contenteditable fields
- MutationObserver-based dynamic editor lifecycle management
- Cursor and selection preservation for targeted text rewrites
- Inline suggestion overlays with grammar/clarity/tone color coding
- AI pipeline with debounced analysis, sentence chunking, and request deduplication
- Grammar fallback (LanguageTool + local typo dictionary)
- Tone analysis with confidence and explanation
- Quick compose modal (`Ctrl+Shift+K`) and sidepanel composer
- Double-click synonym lookup (Datamuse + local fallback)
- Security filtering for sensitive domains and payment/password contexts
- Settings panel with API key, feature toggles, style preferences, blacklist, and dictionary

## Tech Stack

- React + TypeScript + TailwindCSS + Zustand
- Plasmo framework (Manifest V3 extension)
- OpenAI Responses API (structured JSON schema output)
- Floating UI positioning
- Vitest + Playwright testing
- ESLint + Prettier
- Vite tooling + pnpm package manager

## Local setup

```bash
corepack enable pnpm
pnpm install
pnpm exec playwright install chromium
```

## Development

```bash
pnpm dev
```

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

## Build production extension

```bash
pnpm build
pnpm package
```

The production build is generated in `build/chrome-mv3-prod`.

## Load in Brave/Chrome/Edge

1. Open extension management (`brave://extensions`, `chrome://extensions`, or `edge://extensions`)
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `build/chrome-mv3-prod`

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, typecheck, build, and tests on pushes and PRs.

## Exact install/run commands

```bash
corepack enable pnpm
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm exec playwright install chromium
pnpm test
pnpm dev
```
