# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev      # Start Vite dev server (hot reload)
bun run build    # Build extension to dist/
bun run preview  # Preview built output
```

Node 18 is required (see `.nvmrc`). No test suite is configured.

## Architecture

This is a Chrome Extension (Manifest V3) built with Vue 3 + TypeScript + Vite, using the `@crxjs/vite-plugin` to bundle directly into a loadable extension in `dist/`.

**Entry points:**
- `index.html` + `src/main.ts` — the extension's options page (opened in a new tab when the toolbar icon is clicked, or via `Alt+O`)
- `background.js` — service worker; listens for `onInstalled` and opens `index.html` on action click

**Data flow:**
- All saved projects are stored as a JSON array in `localStorage` under the key `all_tabs`
- `src/hooks/` contains thin wrappers around `localStorage` (`useAddToLocalStorage`, `useGetFromLocalStorage`, `useChangeLocalStorage`, `useClearLocalStorage`)
- `src/stores/popup-store.ts` (Pinia) reads from localStorage via `updateFromLocalStorage()` and exposes `items`, `filtered` (search-filtered view), and `search` (reactive input)
- `App.vue` orchestrates the top-level state: capturing current window tabs, saving projects, triggering confirmation dialogs, toggling JSON import/export view

**Data model (`src/interfaces/list/IList.ts`):**
```ts
IList      { id, title, items: IListItem[], updated_at }
IListItem  { title, url }
```

**Component structure:**
- `src/components/header/` — toolbar with dots menu (triggers JSON panel) and search
- `src/components/list/` — `ListItem` (project row) and `SubList`/`SublistItem` (tab rows within a project)
- `src/components/tabs/CurrentTabs` — shows currently open tabs for saving into a project
- `src/components/ui/Json` — JSON import/export panel
- `src/components/popups/Confirm` — generic confirmation dialog
- `src/components/icons/` — SVG icon components
- `src/layouts/` — template stubs (`componentLayout.vue`, `storeLayout.ts`) for scaffolding new components/stores

**Styling:** SCSS in `src/scss/`; global styles loaded via `src/scss/my.scss` in `main.ts`. Design tokens in `src/scss/variables.scss`.

## Loading the extension

After `bun run build`, load the `dist/` folder as an unpacked extension in Chrome (`chrome://extensions` > Load unpacked).
