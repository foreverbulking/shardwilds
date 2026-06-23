# Story ID

STORY-022

## Title

Add One Placeholder Player Object.

## Phase

Phase 2: Three.js Visual Seed.

## Epic

EPIC-020: Tiny 3D Scene.

## User Story

As a developer,
I want one simple placeholder player rendered at the origin,
so that later stories have a body to move and follow with the camera.

## Acceptance Criteria

- [ ] One player placeholder appears at the origin.
- [ ] Built from simple geometry: a sphere head and a capsule body.
- [ ] No movement.
- [ ] No networking.
- [ ] No animation.
- [ ] App still builds and serves.

## Red Checks

- [ ] Scene renders only the ground plane; no player.

## Green Implementation

- `src/Player.tsx`: a `<group>` at `[0,0,0]` with a capsule body (`capsuleGeometry`) and a sphere head (`sphereGeometry`), each with `meshStandardMaterial`.
- Mount `<Player />` inside the `<Canvas>` in `Scene.tsx`.

## Refactor Tasks

- [ ] Keep `Player` a small, self-contained component.
- [ ] Sit the capsule bottom on the ground (`y` offset = half height).
- [ ] No movement/state added (deferred to STORY-024).

## Security Checks

- [ ] No secrets added.
- [ ] Client-only render; no server authority.
- [ ] Abuse cases: N/A — static placeholder.

## Files Expected to Change

```txt
client/src/Player.tsx
client/src/Scene.tsx
docs/stories/STORY-022-placeholder-player.md
```

## Manual Test Plan

1. `cd client && pnpm dev`.
2. Open `http://localhost:5173/`.
3. See one capsule-and-sphere player standing at the center of the ground plane.
4. `pnpm build` succeeds.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
