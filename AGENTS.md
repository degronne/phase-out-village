# Repository Guidelines

## Project Structure & Module Organization

- `src/`: App code. Domain folders under `src/components/` (e.g., `app`,
  `map`, `production`, `emissions`, `ui`); utilities in `src/data/`;
  generated, non-editable sources in `src/generated/`.
- `build/`: Data generation scripts (`generate*.ts`) used to produce files in
  `src/generated/`.
- `public/`: Static assets (images, geojson). Copied as-is to build.
- `dist/`: Build output (ignored in git). `index.html` bootstraps the app;
  entry is `src/main.tsx`.
- `tmp/`: Ephemeral downloads created by data scripts; do not commit.

## Build, Test, and Development Commands

- `npm run dev`: Start Vite dev server with hot reload.
- `npm test`: Type-check (`tsc --noEmit`) and verify formatting
  (`prettier --check .`).
- `npm run build`: Run tests, then build for production (`vite build`).
- Data pipeline:
  - `npm run data`: Download and (re)generate all datasets → `src/generated/`.
  - `npm run data:download` / `npm run data:process`: Baseline data.
  - `npm run data:development` and `npm run data:mdg`: Additional sheets.
    Example: `npm run data && npm run build`.

## Coding Style & Naming Conventions

- Language: TypeScript + React. Use React components in PascalCase; files in
  lowerCamelCase (e.g., `productionSummaryCard.tsx`).
- Formatting: Prettier enforced (2 spaces, double quotes, semicolons, trailing
  commas). Pre-commit runs `npm test` via Husky.
- Structure: Co-locate CSS next to components when applicable. Place hooks in
  `src/hooks/` with `use*` naming. Never edit `src/generated/` by hand—
  regenerate via data scripts.

## Testing Guidelines

- Current checks: TypeScript type-checking and Prettier formatting. No unit
  test suite is configured.
- Expectations: Keep PRs focused; verify UI manually in the browser
  (`npm run dev`). Ensure `npm test` passes and app builds locally.

## Commit & Pull Request Guidelines

- Commits: Prefer Conventional Commits (`feat:`, `fix:`, `chore:`). Write
  clear, imperative subjects.
- PRs: Include a concise description, linked issues, steps to test, and
  screenshots/GIFs for UI changes. If data changes, run `npm run data` and
  commit updated files in `src/generated/` (but avoid `tmp/`). Confirm
  `npm test` and `npm run build` succeed.
- CI: Main pushes build and deploy via GitHub Actions
  (`.github/workflows/publish.yml`).

## Security & Configuration Tips

- Node 22.x is used in CI. No secrets are required for local dev. Data scripts
  fetch from public Google Apps Script endpoints—re-run them when upstream data
  changes.
