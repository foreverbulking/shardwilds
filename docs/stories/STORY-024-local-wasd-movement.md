# Story ID

STORY-024

## Title

Add Basic WASD Movement Locally.

## Phase

Phase 2: Three.js Visual Seed.

## Epic

EPIC-020: Tiny 3D Scene.

## User Story

As a developer,
I want to move the placeholder player with WASD on the ground plane,
so that the local movement feel can be tuned before server-authoritative movement (Phase 5).

## Acceptance Criteria

- [ ] WASD (and arrow keys) move the player on the plane.
- [ ] Movement is client-only — no server connection.
- [ ] The camera follows the moving player.
- [ ] Movement code is simple and readable.
- [ ] App still builds and serves.

## Red Checks

- [ ] Keys do nothing; player is static at the origin.

## Green Implementation

- `src/useWASD.ts`: ref-based key-state hook (WASD + arrows), no re-renders.
- `src/Player.tsx`: `useFrame` integrates input into a shared position ref (`SPEED * delta`, normalized diagonal) and applies it to the player group.
- `src/CameraRig.tsx`: follows the shared position ref (offset + lookAt).
- `src/Scene.tsx`: owns the shared `Vector3` position ref, wires it to `Player` and `CameraRig`.

## Refactor Tasks

- [ ] Normalize diagonal movement so it isn't faster.
- [ ] Reuse `Vector3` temporaries in the camera rig (no per-frame allocation).
- [ ] No client-side bounds clamping — zone bounds are enforced server-side later (STORY-051).
- [ ] No animation library added (idiomatic `useFrame`).

## Security Checks

- [ ] No secrets added.
- [ ] Movement is purely local/visual; the server will own authoritative position later. No trust placed in this path.
- [ ] Abuse cases: N/A here — client-only prototype, no server state.

## Files Expected to Change

```txt
client/src/useWASD.ts
client/src/Player.tsx
client/src/CameraRig.tsx
client/src/Scene.tsx
docs/stories/STORY-024-local-wasd-movement.md
```

## Manual Test Plan

1. `cd client && pnpm dev`.
2. Open `http://localhost:5173/`.
3. Press W/A/S/D (or arrows) — the player moves on the plane, camera follows.
4. `pnpm build` succeeds.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
