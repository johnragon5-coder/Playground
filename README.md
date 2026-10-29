# Clock Stack

A responsive time-clock themed stacking game. Drop moving shifts onto the stack: each overlap banks eight hours, near-perfect alignment keeps the entire shift, and a miss clocks you out. Speed increases as the stack grows.

## Develop

Requires Node.js 20.19+ or 22.12+ (validated with Node 24).

```sh
npm ci --cache /tmp/clock-stack-npm
npm run dev
```

## Validate

```sh
npm test
npm run build
npm run test:e2e
```

Browser tests default to `/usr/bin/chromium`. On other machines, install a Playwright browser with `npx playwright install chromium` and set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable, or point the variable at a locally installed Chromium/Chrome. CI installs Chromium and discovers its executable automatically.

## Controls

- Click **Clock in & play** to begin.
- Press Space, tap the board, or click **Drop shift** to place a shift.
- Press P or use the pause button to pause/resume.
- Open **How to play** for instructions. Opening help or leaving the tab pauses active play.
- Best scores are stored locally on your device. The game works if local storage is unavailable.

The score is fictional game time, not an employee time record. No backend, accounts, or secrets are required. Work Sans regular, medium, and semibold fonts are bundled locally; the game does not request fonts from a third-party service.

## Reference

Inspired by the supplied Savings Stacks reference and adapted to a time tracking theme with original interface and assets. The reference site was blocked by the development environment's network proxy, so visual and mechanic parity has not been verified.

## Publish with GitHub Pages

In this repository's **Settings → Pages**, select **GitHub Actions** as the build source. No custom domain is needed. After merging into `main`, the Pages workflow tests, builds with the `/Playground/` asset base, and deploys `dist` to https://johnragon5-coder.github.io/Playground/. Later pushes to `main` update the game automatically. A successful GitHub Actions deployment is required before the public URL is live.

## WorkEasy styling and score sharing

Uses the supplied navy (`#132F45`), white, cool gray (`#E9EFF4`), muted text (`#546571`), orange gradient, and purple accent palette. Work Sans is bundled in regular, medium, and semibold weights. The clock icon is an original game mark in the supplied colors; an official company logo was not supplied.

After game over, the final score offers **Share your score**. Players can preview/copy their score, post via X, share the game link on Facebook, or use their device's native share menu when available. Facebook does not prefill score text, so the panel explains how to copy it. Sharing is always initiated by the player. Clipboard denial provides a selectable text fallback; dismissing a native share sheet keeps the result visible. No social accounts, backend, or API keys are required.
