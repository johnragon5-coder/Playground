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

The score is fictional game time, not an employee time record. No backend, accounts, or secrets are required. Fonts fall back to system fonts when Google Fonts is unavailable.

## Reference

Inspired by the supplied Savings Stacks reference and adapted to a time tracking theme with original interface and assets. The reference site was blocked by the development environment's network proxy, so visual and mechanic parity has not been verified.
