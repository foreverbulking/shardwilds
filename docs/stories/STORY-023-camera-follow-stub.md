# Story ID

STORY-023

## Title

Add Camera Follow Stub.

## Phase

Phase 2: Three.js Visual Seed.

## Epic

EPIC-020: Tiny 3D Scene.

## User Story

As a developer,
I want a camera rig that frames the player placeholder,
so that movement (STORY-024) has a camera to follow it.

## Acceptance Criteria

- [ ] A camera rig points at the player placeholder.
- [ ] The camera frames the player.
- [ ] No full orbit/free controls added.
- [ ] App still builds and serves.

## Red Checks

- [ ] Camera only uses the static `<Canvas>` default; no rig pointing at the player.

## Green Implementation

- `src/CameraRig.tsx`: a render-null component using `useThree` + `useFrame` to `lerp` the camera toward a fixed follow offset and `lookAt` the player's mid-body target.
- Mount `<CameraRig />` inside the `<Canvas>`.

## Refactor Tasks

- [ ] Keep follow offset and look target as named constants.
- [ ] Note: STORY-024 will drive the look target from the live player position.
- [ ] No orbit controls / no input handling here.

## Security Checks

- [ ] No secrets added.
- [ ] Client-only render; no server authority.
- [ ] Abuse cases: N/A — camera framing only.

## Files Expected to Change

```txt
client/src/CameraRig.tsx
client/src/Scene.tsx
docs/stories/STORY-023-camera-follow-stub.md
```

## Manual Test Plan

1. `cd client && pnpm dev`.
2. Open `http://localhost:5173/`.
3. The camera frames the player centered on screen.
4. `pnpm build` succeeds.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
