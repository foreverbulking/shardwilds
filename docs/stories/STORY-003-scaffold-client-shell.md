# Story ID

STORY-003

## Title

Scaffold Client Shell.

## Phase

Phase 0: Project Foundation.

## Epic

Client Foundation.

## User Story

As a developer,
I want a minimal Vite + React + TypeScript client that builds and runs,
so that later stories have a working app shell to extend without fighting setup.

## Acceptance Criteria

- [ ] `client/` is a Vite + React + TypeScript project managed with pnpm.
- [ ] `pnpm install` succeeds in `client/`.
- [ ] `pnpm build` type-checks and builds with no errors.
- [ ] `pnpm dev` serves the app locally.
- [ ] The page shows "Shardwilds Dev Client".
- [ ] No Three.js / React Three Fiber added.
- [ ] No SpacetimeDB client or connection added.
- [ ] Default Vite demo files (logos, counter, demo CSS, template README) removed.

## Red Checks

What should fail before implementation?

- [ ] `client/` has only `.gitkeep`, no `package.json`.
- [ ] `pnpm dev` cannot run (nothing to run).

## Green Implementation

Smallest implementation that satisfies the story:

- Scaffold `client/` with `pnpm create vite@latest client --template react-ts`.
- `pnpm install`.
- Replace `src/App.tsx` with a single `<h1>Shardwilds Dev Client</h1>`.
- Set the page `<title>` to `Shardwilds Dev Client`.

## Refactor Tasks

- [ ] Remove demo assets (`react.svg`, `vite.svg`, `hero.png`, `icons.svg`).
- [ ] Remove demo styles (`App.css`); reduce `index.css` to a minimal reset.
- [ ] Remove the Vite template `README.md` (root README covers the project).
- [ ] No network/state/systems layers yet — added in later stories.

## Security Checks

- [ ] No secrets in client code or config.
- [ ] No gameplay authority on the client (no game logic yet).
- [ ] Abuse cases reviewed: N/A — empty shell, no server contact.

## Files Expected to Change

```txt
client/package.json
client/pnpm-lock.yaml
client/index.html
client/vite.config.ts
client/tsconfig.json
client/tsconfig.app.json
client/tsconfig.node.json
client/eslint.config.js
client/.gitignore
client/public/favicon.svg
client/src/main.tsx
client/src/App.tsx
client/src/index.css
docs/stories/STORY-003-scaffold-client-shell.md
```

## Manual Test Plan

1. `cd client && pnpm install` — completes with no errors.
2. `pnpm build` — `tsc -b && vite build` succeed.
3. `pnpm dev` — Vite serves on `http://localhost:5173/`.
4. Open the URL — page renders "Shardwilds Dev Client".

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
