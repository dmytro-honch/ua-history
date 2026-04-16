# ua-history

Interactive map of Ukrainian history with a timeline. Users explore historical
events on the map filtered by year through a custom time range input.

## Stack

- React 19 + TypeScript
- Vite
- TanStack Query — JSON data fetching
- Canvas API — map and event rendering
- Plain CSS (no frameworks)
- Prettier — code formatting

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview build
```

## Project Structure

```
src/
  components/    # React components
  config/        # constants and config
  hooks/         # custom hooks
  layouts/       # layout components
  lib/           # utilities and helpers
  providers/     # React providers (TanStack Query etc.)
  routes/        # routing
  styles/        # global styles
  App.tsx
  main.tsx

public/data/
  events/        # historical events split by epoch
    prehistoric/
    ancient/
    medieval/
    early-modern/
    modern/
    contemporary/
  i18n/
    uk.json      # Ukrainian localization
    en.json      # English localization
  lib/           # JS helpers for data processing
    cleanProps.js
    minify.js
    simplify.js
  territories/   # temporary folder, geojson for Firebase (do not edit)
```

## External Data

- **Firebase** — static map layers (Ukraine borders and neighboring countries)
- **public/data/events/** — JSON files with historical events
- **public/data/i18n/** — UI translations

## Architecture

The project has three parts:

**1. Map interface** — the main user-facing interface.
Canvas renders a static map (from Firebase) + dynamic events (from JSON).
The time range input changes the year — Canvas re-renders with filtered events.

**2. JSON data** — single source of truth for events.
Events are stored in `public/data/events/{epoch}/`.
Helpers in `public/data/lib/` are used for data preparation (not at runtime).

**3. Admin form** — interface for editors to populate the event JSON files.

## Event JSON Structure

```ts
// TO BE DONE
```

## Code Conventions

- Components: `PascalCase`, one file = one component
- Hooks: `use*` prefix, live in `src/hooks/`
- Canvas logic: lives in `src/lib/` or a dedicated folder, NOT inside components
- CSS: co-located with component — `ComponentName.css`
- Types: defined close to usage, shared ones go in `src/lib/` or a dedicated `types.ts`
- No `any` in TypeScript

## Do NOT

- Write Canvas logic inside React components
- Edit files in `public/data/territories/` — this is a temporary folder with maps we are using on Firebase
- Modify files in `public/data/lib/` without knowing why — these are offline helpers
- Duplicate strings that already exist in i18n files
- Add new npm packages without discussion
- Use inline styles