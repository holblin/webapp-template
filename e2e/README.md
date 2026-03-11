# E2E Testing (Playwright)

## Install Browsers

```bash
npm run e2e:install
```

## Run Tests

```bash
npm run e2e
```

Useful variants:

- `npm run e2e:ui`
- `npm run e2e:headed`
- `npm run e2e:debug`

## Notes

- Tests run against the real frontend (`http://127.0.0.1:4080`) and backend (`http://127.0.0.1:4000`).
- The Playwright config starts both servers automatically via `webServer`.
- Frontend server startup for E2E runs GraphQL codegen once before launching Vite.
