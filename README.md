# AetherWrite Extension

AetherWrite is a browser extension that helps you improve writing inside text boxes on websites.

It works in Brave, Chrome, and Edge.

## What this project can do

- Spot grammar and clarity problems
- Suggest tone improvements
- Help rewrite selected text
- Show synonym ideas
- Open a quick compose window with `Ctrl + Shift + K`

## Before you start

You need these things on your computer:

1. **Node.js**
2. **pnpm** package manager
3. **Brave, Chrome, or Edge**

If you already have Node.js, turn on pnpm with:

```bash
corepack enable pnpm
```

## Step 1: Install the project

Open a terminal inside this project folder and run:

```bash
pnpm install
```

This downloads all the packages the extension needs.

## Step 2: Start the extension in development mode

Run:

```bash
pnpm dev
```

This starts the local development build.

## Step 3: Build the extension

When you want a build you can load in the browser, run:

```bash
pnpm build
```

If you want a packaged production build, run:

```bash
pnpm package
```

The build output is created in:

```text
build/chrome-mv3-prod
```

## Step 4: Load the extension in your browser

### Brave

1. Open `brave://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Choose the folder `build/chrome-mv3-prod`

### Chrome

1. Open `chrome://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Choose the folder `build/chrome-mv3-prod`

### Edge

1. Open `edge://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Choose the folder `build/chrome-mv3-prod`

## Step 5: Run the checks

Use these commands to make sure everything is working:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Step 6: Run the tests

First install the Playwright browser used by the tests:

```bash
pnpm exec playwright install chromium
```

Then run:

```bash
pnpm test
```

## Quick command list

```bash
corepack enable pnpm
pnpm install
pnpm dev
pnpm build
pnpm package
pnpm lint
pnpm typecheck
pnpm exec playwright install chromium
pnpm test
```

## For developers

This project uses:

- React
- TypeScript
- Tailwind CSS
- Zustand
- Plasmo
- Vitest
- Playwright

## CI

GitHub Actions runs lint, typecheck, build, and tests on pushes and pull requests.
