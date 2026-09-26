# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b` (typecheck via project references) then `vite build`
- `npm run lint` — Oxlint
- `npm run preview` — serve the production build

There is no test setup in this project yet.

## State of the project

This is the stock `create-vite` React + TypeScript scaffold, essentially unmodified: `src/App.tsx` is still the template landing page (counter, logos, docs links) and `src/main.tsx` is the `createRoot` + `StrictMode` entry. Treat everything under `src/` as placeholder content to be replaced, not as an existing architecture to preserve.

## Toolchain notes

- **React 19, Vite 8, TypeScript 6** — recent majors; verify API assumptions against the installed versions in `node_modules` rather than older-release habits.
- **Oxlint, not ESLint.** Config lives in `.oxlintrc.json` (`react`, `typescript`, `oxc` plugins). Type-aware rules are off; `README.md` documents how to enable them via `oxlint-tsgolint`.
- **Split tsconfigs.** `tsconfig.json` is a solution file referencing `tsconfig.app.json` (`src/`, DOM libs, `jsx: react-jsx`) and `tsconfig.node.json` (`vite.config.ts`, node types). Build/typecheck runs `tsc -b`, so new files must fall under one of the two `include` globs or they are never checked.
- `verbatimModuleSyntax` and `erasableSyntaxOnly` are on: use `import type` for type-only imports, and avoid enums, parameter properties, and namespaces.
- `noUnusedLocals` / `noUnusedParameters` are errors, so unused scaffolding breaks the build.
- The React Compiler is deliberately not enabled (see `README.md`).

## Assets

`public/` files (`icons.svg`, `favicon.svg`) are referenced by absolute URL (`/icons.svg#documentation-icon`); `src/assets/` files are imported as modules and hashed by Vite.
