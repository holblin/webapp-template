# Frontend E2E Testing

This repository uses Playwright for end-to-end tests.

## Location

- Config: `playwright.config.ts`
- Tests: `e2e/tests`

## Commands

- Install browsers:
  `npm run e2e:install`
- Run E2E tests:
  `npm run e2e`
- UI mode:
  `npm run e2e:ui`
- Headed mode:
  `npm run e2e:headed`
- Debug mode:
  `npm run e2e:debug`

## How It Runs

Playwright starts:

1. backend server (`npm run dev:e2e --workspace webapp-template-backend`)
2. frontend server (`npm run e2e:frontend-server`)

The frontend E2E server script runs codegen first, then starts Vite on `127.0.0.1:4080`.
