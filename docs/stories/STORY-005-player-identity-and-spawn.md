# Story ID

STORY-005

## Title

Player Identity and Spawn — Design Only.

## Phase

Phase 1: Hearthvale Online.

## Epic

Player Identity and World Entry.

## User Story

As a developer,
I want the server tables and reducers for player identity and spawning fully designed before coding,
so that implementation follows a server-authoritative, abuse-resistant contract instead of being improvised.

## Acceptance Criteria

- [ ] Design document exists at `docs/architecture/player-identity-and-spawn.md`.
- [ ] Tables are specified: `Player`, `Character`, `Position`, `Zone` (+ `SpawnAudit`).
- [ ] Reducers are specified: `init`, `identity_connected`, `identity_disconnected`, `create_character`, `spawn_character` (+ optional `despawn_character`).
- [ ] Client subscriptions are specified.
- [ ] Ownership checks are specified and map to `docs/05-security-and-anticheat.md`.
- [ ] Abuse cases are enumerated with mitigations.
- [ ] A Red/Green/Refactor plan is included.
- [ ] No server or client code is written in this story.

## Red Checks

What should fail before implementation? (This story is design-only; these are the checks the *implementation* story must satisfy.)

- [ ] No `Player` row is created on connect.
- [ ] `create_character` has no name/uniqueness/cap validation.
- [ ] `spawn_character` allows spawning a character the caller does not own.
- [ ] Spawn position can be influenced by the client.

## Green Implementation

Smallest implementation that satisfies the design (deferred to the implementation story):

- Define the tables and seed `Zone` Hearthvale in `init`.
- Add connect/disconnect player lifecycle.
- Add `create_character` and `spawn_character` with all ownership and validation checks.

See [`../architecture/player-identity-and-spawn.md`](../architecture/player-identity-and-spawn.md) for the full design.

## Refactor Tasks

- [ ] Extract validation helpers (name normalize/validate, ownership guard, zone lookup).
- [ ] Log every rejection to `SpawnAudit`.
- [ ] Add indexes (`owner`, `zone_id`) and `name` uniqueness.
- [ ] Update `docs/03-architecture-by-phase.md` if reducer signatures drift.

## Security Checks

- [ ] Identity comes only from `ctx.sender`; never from arguments.
- [ ] `spawn_character` validates `owner == ctx.sender`.
- [ ] Server owns spawn coordinates; client supplies none.
- [ ] `create_character` enforces uniqueness and a per-identity cap.
- [ ] Abuse cases reviewed (see design doc).

## Files Expected to Change

```txt
docs/stories/STORY-005-player-identity-and-spawn.md
docs/architecture/player-identity-and-spawn.md
```

(Implementation story — separate — will touch `server/src/lib.rs` and generated client bindings.)

## Manual Test Plan

1. Review `docs/architecture/player-identity-and-spawn.md`.
2. Confirm every table has a primary key and an access-pattern rationale.
3. Confirm every reducer lists its ownership and validation checks.
4. Confirm each abuse case has a concrete mitigation.
5. Confirm the design adds no movement, chat, or combat scope.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
