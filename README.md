# Senior State Tax Breaks Map

Interactive Vercel-ready site for exploring 2026 senior state tax breaks by state.

The UI uses PolicyEngine's shared design tokens from `@policyengine/ui-kit` and the official logo assets sourced from `policyengine-app-v2`.

The state tax break data shown in the app comes from PolicyEngine US.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- `@policyengine/ui-kit` for design tokens and theme CSS
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- `react-simple-maps` for the U.S. map
- Vitest for unit tests
- bun as the package manager

## Local development

```bash
bun install
bun run dev
```

The dev server runs at http://localhost:3000.

Other scripts:

```bash
bun run build       # production build
bun run start       # start production build
bun run lint        # ESLint
bun run typecheck   # tsc --noEmit
bun run test        # Vitest
```

## Deployment

Import the repository into Vercel — Next.js is auto-detected, no `vercel.json` is required.

## Data

The app reads directly from the source data file at `public/senior_state_tax_breaks_2026.csv`, so updating that file updates the map and detail panels.
