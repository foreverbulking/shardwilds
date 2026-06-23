# Story ID

STORY-021

## Title

Render Empty 3D Scene.

## Phase

Phase 2: Three.js Visual Seed.

## Epic

EPIC-020: Tiny 3D Scene.

## User Story

As a developer,
I want the client to render a minimal lit 3D scene with a ground plane,
so that the rendering pipeline is proven before adding a player or props.

## Acceptance Criteria

- [ ] An R3F `<Canvas>` renders in the browser.
- [ ] Scene has a camera, ambient light, and directional light.
- [ ] One flat ground plane is visible.
- [ ] No player.
- [ ] No village / props.
- [ ] App still builds and serves.

## Red Checks

- [ ] `App.tsx` renders only text; no `<Canvas>` / 3D scene.
- [ ] Nothing imports `three` yet (no `@types/three`).

## Green Implementation

- Add `@types/three` (dev) — first `three` import.
- `src/Scene.tsx`: `<Canvas>` with camera `[0,5,9]` fov 50, ambient + directional light, a 20×20 ground plane (rotated flat, `meshStandardMaterial`).
- `App.tsx`: render `<Scene />` + a fixed HUD label `Shardwilds Dev Client`.
- `index.css`: full-viewport layout so the canvas fills the screen.

## Refactor Tasks

- [ ] Keep scene component small and readable.
- [ ] Full-viewport canvas; HUD overlay non-interactive.
- [ ] Note: `THREE.Clock` deprecation warning comes from R3F internals (three 0.184); not our code.

## Security Checks

- [ ] No secrets added.
- [ ] Client-only render; no server authority.
- [ ] Abuse cases: N/A — static scene.

## Files Expected to Change

```txt
client/package.json
client/pnpm-lock.yaml
client/src/Scene.tsx
client/src/App.tsx
client/src/index.css
docs/stories/STORY-021-empty-3d-scene.md
```

## Manual Test Plan

1. `cd client && pnpm dev`.
2. Open `http://localhost:5173/`.
3. See a flat green ground plane with the `Shardwilds Dev Client` label.
4. `pnpm build` succeeds.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
