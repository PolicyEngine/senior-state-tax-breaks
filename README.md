# Senior State Tax Breaks Map

Interactive Vercel-ready site for exploring 2026 senior state tax breaks by state.

The UI uses PolicyEngine’s shared design tokens from `@policyengine/design-system` and the official logo assets sourced from `policyengine-app-v2`.

The state tax break data shown in the app comes from PolicyEngine US.

## Local development

```bash
npm install
npm run dev
```

## Deployment

Import the repository into Vercel. The included [`vercel.json`](/Users/daphnehansell/Documents/GitHub/senior-state-tax-breaks/vercel.json) points Vercel at the Vite build output in `dist/`.

## Data

The app reads directly from the source data file at [`public/senior_state_tax_breaks_2026.csv`](/Users/daphnehansell/Documents/GitHub/senior-state-tax-breaks/public/senior_state_tax_breaks_2026.csv), so updating that file updates the map and detail panels.
