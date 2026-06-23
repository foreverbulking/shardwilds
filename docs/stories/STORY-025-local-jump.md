# Story ID

STORY-025

## Title

Add Local Player Jump.

## Phase

Phase 2: Three.js Visual Seed (ad-hoc extension beyond the backlog).

## Epic

EPIC-020: Tiny 3D Scene.

## User Story

As a developer,
I want the local player to jump with the spacebar,
so that vertical movement feel can be tuned before server-authoritative movement.

## Acceptance Criteria

- [ ] Spacebar makes the player jump.
- [ ] The player rises and falls under gravity, landing back on the ground (y = 0).
- [ ] Cannot jump again while airborne (no double jump).
- [ ] Holding space does not auto-bounce (one jump per press).
- [ ] The camera does not bob vertically during a jump.
- [ ] Client-only; no server.
- [ ] App still builds.

## Red Checks

- [ ] Spacebar does nothing; player stays on the ground.

## Green Implementation

- `useWASD.ts`: add an edge-triggered `jumpRequested` (Space), guarded by a `jumpHeld` ref so auto-repeat doesn't re-trigger.
- `Player.tsx`: vertical velocity + gravity integration; jump only when grounded; clamp at `y = 0`.
- `CameraRig.tsx`: follow X/Z only, fixed camera height, so the hop is visible.

## Refactor Tasks

- [ ] Tunable constants: `JUMP_SPEED`, `GRAVITY`.
- [ ] One jump per key press (edge trigger).
- [ ] No animation library.

## Security Checks

- [ ] No secrets added.
- [ ] Local/visual only; server will own authoritative movement later. No trust placed here.
- [ ] Abuse cases: N/A — client-only prototype.

## Files Expected to Change

```txt
client/src/useWASD.ts
client/src/Player.tsx
client/src/CameraRig.tsx
docs/stories/STORY-025-local-jump.md
```

## Manual Test Plan

1. `cd client && pnpm dev`.
2. Open `http://localhost:5173/`.
3. Press Space — the player jumps and lands; WASD still moves; jumping mid-move works.
4. `pnpm build` succeeds.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
