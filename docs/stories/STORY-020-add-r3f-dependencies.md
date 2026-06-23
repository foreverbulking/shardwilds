# Story ID

STORY-020

## Title

Add React Three Fiber Dependencies.

## Phase

Phase 2: Three.js Visual Seed.

## Epic

EPIC-020: Tiny 3D Scene.

## User Story

As a developer,
I want the React Three Fiber rendering stack installed in the client,
so that the next stories can render a 3D scene without setup friction.

## Acceptance Criteria

- [ ] `three`, `@react-three/fiber`, `@react-three/drei` are dependencies of the client.
- [ ] `pnpm build` succeeds.
- [ ] `pnpm dev` serves the app (still shows "Shardwilds Dev Client").
- [ ] No physics library added.
- [ ] No assets added.
- [ ] No 3D code added yet (deps only).

## Red Checks

- [ ] `three` / `@react-three/*` absent from `client/package.json`.

## Green Implementation

- `cd client && pnpm add three @react-three/fiber @react-three/drei`.

## Refactor Tasks

- [ ] Confirm the app still builds and serves with no code changes.
- [ ] Note follow-up: `three` ships no bundled types, so `@types/three` (dev) is needed in STORY-021 when the first `three` import lands.

## Security Checks

- [ ] No secrets added.
- [ ] Client-only change; no server authority involved.
- [ ] Abuse cases: N/A — dependency addition only.

## Files Expected to Change

```txt
client/package.json
client/pnpm-lock.yaml
docs/stories/STORY-020-add-r3f-dependencies.md
```

## Manual Test Plan

1. `cd client && pnpm install` (or `pnpm add ...`).
2. `pnpm build` — succeeds.
3. `pnpm dev` — open `http://localhost:5173/`, page still renders.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
