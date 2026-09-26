# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

- 作るもの：日報テンプレートジェネレーター
  技術：Vite + React + TypeScript
- 対象：コードを書いた経験ゼロの受講者

## 開発ルール

1. コードを書く前に方針を3行で説明する
2. 一度に1つの機能だけ実装する
3. 主に触るのは `src/App.tsx` のみ
4. できたら必ずブラウザで動作確認を促す

## 制約（禁止事項）

- 追加のライブラリはインストールしない
- CSS は `src/index.css` に書く
- データベースや保存機能は作らない

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b` (typecheck via project references) then `vite build`
- `npm run lint` — Oxlint
- `npm run preview` — serve the production build

There is no test setup in this project yet.

## State of the project

`src/App.tsx` holds the whole tool: a `{date, client, content, nextAction}` state object, a `useMemo` that renders it into the plain-text report, and a copy button (`navigator.clipboard` with an `execCommand` fallback). `src/main.tsx` is the `createRoot` + `StrictMode` entry and should not need changes. All styling lives in `src/index.css`; there is no `App.css`.

## Toolchain notes

- **React 19, Vite 8, TypeScript 6** — recent majors; verify API assumptions against the installed versions in `node_modules` rather than older-release habits.
- **Oxlint, not ESLint.** Config lives in `.oxlintrc.json` (`react`, `typescript`, `oxc` plugins). Type-aware rules are off; `README.md` documents how to enable them via `oxlint-tsgolint`.
- **Split tsconfigs.** `tsconfig.json` is a solution file referencing `tsconfig.app.json` (`src/`, DOM libs, `jsx: react-jsx`) and `tsconfig.node.json` (`vite.config.ts`, node types). Build/typecheck runs `tsc -b`, so new files must fall under one of the two `include` globs or they are never checked.
- `verbatimModuleSyntax` and `erasableSyntaxOnly` are on: use `import type` for type-only imports, and avoid enums, parameter properties, and namespaces.
- `noUnusedLocals` / `noUnusedParameters` are errors, so unused scaffolding breaks the build.
- The React Compiler is deliberately not enabled (see `README.md`).

## Assets

`public/` files (`icons.svg`, `favicon.svg`) are referenced by absolute URL; `src/assets/` files are imported as modules and hashed by Vite. Both are leftovers from the Vite template and are currently unused by the app.
