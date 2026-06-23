# Player Identity and Spawn — Architecture

Phase 1 (Hearthvale Online) design slice. **Design only — no implementation.**

Covers how a raw connection becomes an authenticated player, how a player creates a character, and how a character spawns into the starting zone at a **server-owned** position.

Out of scope (later stories): movement, chat, gathering, crafting, trade, combat.

References: [`../03-architecture-by-phase.md`](../03-architecture-by-phase.md) (Phase 1 tables/reducers), [`../05-security-and-anticheat.md`](../05-security-and-anticheat.md) (trust model), [`../../server/CLAUDE.md`](../../server/CLAUDE.md) (SpacetimeDB Rust SDK).

## Trust Model Recap

- The browser is hostile. The server owns truth.
- Identity = the SpacetimeDB authenticated principal = `ctx.sender`. **Never** accept identity/owner as a reducer argument.
- Position is server-owned. The client never writes position. Spawning uses the zone's fixed spawn point — the client supplies no coordinates.

## Tables

### `Player` — account, one row per identity

| Column | Type | Notes |
|--------|------|-------|
| `identity` | `Identity` | **primary key**; equals `ctx.sender` |
| `created_at` | `Timestamp` | set on first connect |
| `last_seen` | `Timestamp` | updated on connect/disconnect |
| `online` | `bool` | connection state |

Public read (others may see online state). Writes only via lifecycle reducers.

### `Character` — avatar, one or more per player (M0 cap = 1)

| Column | Type | Notes |
|--------|------|-------|
| `character_id` | `u64` | **primary key**, `auto_inc` |
| `owner` | `Identity` | `index(btree)`; equals creator's `ctx.sender` |
| `name` | `String` | `unique` (on normalized form) |
| `created_at` | `Timestamp` | |
| `home_zone_id` | `u32` | starting zone |

Public read (nameplates, character select). Writes only via reducers.

### `Position` — live transform of a spawned character

| Column | Type | Notes |
|--------|------|-------|
| `character_id` | `u64` | **primary key**, foreign key → `Character` |
| `zone_id` | `u32` | `index(btree)` — subscription filter |
| `x` / `y` / `z` | `f32` | server-set at spawn |
| `yaw` | `f32` | facing |
| `spawned` | `bool` | true while present in the world |
| `updated_at` | `Timestamp` | |

Public read, filtered by zone. Writes only via reducers (spawn now; movement later).

> Design note: `Position` is split from `Character` by access pattern — `Character` is static identity, `Position` is hot world state (per `server/CLAUDE.md`: "organize data by access pattern, not by entity").

### `Zone` — static world definition + spawn point

| Column | Type | Notes |
|--------|------|-------|
| `zone_id` | `u32` | **primary key** |
| `name` | `String` | |
| `spawn_x` / `spawn_y` / `spawn_z` | `f32` | fixed spawn point |
| `spawn_yaw` | `f32` | |
| `min_x` / `min_z` / `max_x` / `max_z` | `f32` | bounds (used by later movement validation) |
| `active` | `bool` | |

Seeded in `init`. M0: a single zone, "Hearthvale".

### `SpawnAudit` — security log (recommended)

| Column | Type | Notes |
|--------|------|-------|
| `id` | `u64` | **primary key**, `auto_inc` |
| `identity` | `Identity` | offending caller |
| `character_id` | `Option<u64>` | when relevant |
| `action` | `String` | e.g. `spawn_character` |
| `reason` | `String` | e.g. `not_owner`, `already_spawned`, `dup_name` |
| `at` | `Timestamp` | |

Private table (owner/admin only). Satisfies `docs/05` "log failed ownership checks / suspicious behavior".

## Reducers

All signatures are **design pseudocode**, not final code.

### `init` (lifecycle)
Seed `Zone` Hearthvale (spawn point, bounds, `active = true`). Idempotent — skip if the zone already exists.

### `identity_connected` (`client_connected`)
- Upsert `Player` for `ctx.sender`: create if absent (`created_at = now`), set `online = true`, `last_seen = now`.
- Does **not** auto-create a character. No rewards on connect.

### `identity_disconnected` (`client_disconnected`)
- `Player.online = false`, `last_seen = now`.
- For owned characters with `Position.spawned = true` → set `spawned = false` (despawn). Keeps the world clean.

### `create_character(name: String) -> Result<(), String>`
Server-side validation, in order:
1. A `Player` row exists for `ctx.sender` (caller is connected).
2. `name`: trim; length 3–20; charset allowlist `[A-Za-z0-9 _-]`; not blank; normalize (casefold + collapse whitespace) for the uniqueness key; profanity filter (stub for M0).
3. Uniqueness: no existing `Character` with the same normalized name.
4. Cap: characters owned by `ctx.sender` < `MAX_CHARACTERS` (M0 = 1).

On success: insert `Character { character_id: 0, owner: ctx.sender, name, created_at: now, home_zone_id: HEARTHVALE }`.
On rejection: return `Err` + write `SpawnAudit`. Owner and id are **never** taken from the client.

### `spawn_character(character_id: u64) -> Result<(), String>`
Server-side validation, in order:
1. `Character` exists (find by `character_id`).
2. Ownership: `character.owner == ctx.sender` (else reject + log).
3. Zone: `home_zone_id` resolves to an `active` `Zone`.
4. Not already spawned: no `Position` with `spawned = true` for this character (idempotency / anti-dupe). If a `spawned = false` row exists, update it; else insert.
5. (Optional) rate limit: reject if `spawn_character` called more than N times per window.

Effect: write `Position` at the **zone spawn point** (server coordinates), `spawned = true`, `updated_at = now`. The client supplies **no** coordinates.

### `despawn_character(character_id: u64) -> Result<(), String>` (optional)
Ownership check; set `spawned = false`. Also covered implicitly by `identity_disconnected`. (`docs/03`'s `logout` = despawn + mark offline; for M0, disconnect handles it.)

## Client Subscriptions

- `Player WHERE identity == sender` — own account state.
- `Character WHERE owner == sender` — own characters / select screen.
- `Zone WHERE active == true` — world + spawn metadata.
- `Character` (public) joined with `Position WHERE zone_id == currentZone AND spawned == true` — render other players' avatars/nameplates.

Group subscriptions by lifetime: a stable account/own-character subscription vs. a per-zone subscription that is re-subscribed on zone change. Avoid overlapping queries (`server/CLAUDE.md` best practices).

## Ownership & Validation Summary (maps to `docs/05`)

- **Identity source:** `ctx.sender` only — never an argument.
- **`create_character`:** player-exists, name rules, uniqueness, per-identity cap.
- **`spawn_character`:** ownership, character-exists, zone-active, not-already-spawned.
- **`Position`:** server-written only; client cannot set coordinates (no teleport).
- **Logging:** every rejection writes `SpawnAudit` (`docs/05` "required logs").

## Abuse Cases

| Abuse | Vector | Mitigation |
|-------|--------|------------|
| Identity spoofing | pass another identity as an argument | ignore args; use `ctx.sender` |
| Spawn another's character | call `spawn_character` on a foreign id | `owner == ctx.sender` check + log |
| Spawn-point bypass / teleport | client sends coordinates | reducer ignores client coords; uses `Zone` spawn point |
| Duplicate spawn / state dupe | spam `spawn_character` | idempotent `spawned` flag; reject if already spawned |
| Name impersonation / abuse | homoglyphs, profanity, whitespace tricks | normalize, charset allowlist, uniqueness, length, profanity stub |
| Character flooding | spam `create_character` | per-identity cap (M0 = 1) |
| Connect/disconnect churn | abuse lifecycle to reset state | idempotent connected/disconnected; no rewards on connect |
| Invalid / restricted zone | craft `home_zone_id` | validate against a seeded, `active` `Zone` |
| Direct table write | tamper with `Position` / `Character` | SpacetimeDB: client writes go through reducers only; public tables are read-only to clients |

## Red / Green / Refactor Plan

**Red — write failing checks first:**
- Connecting creates exactly one `Player`; a second connect does not duplicate it.
- `create_character` rejects blank / too-short / too-long / duplicate names; rejects when over cap; rejects when no `Player`.
- `spawn_character` rejects foreign ownership; rejects already-spawned; rejects an inactive zone.
- Spawn sets `Position` to the `Zone` spawn point exactly; no client-supplied coordinate path exists.
- Manual: confirm the client cannot write `Position` directly.

**Green — smallest implementation:**
- Define `Player` / `Character` / `Position` / `Zone` (+ `SpawnAudit`).
- `init` seeds Hearthvale.
- `identity_connected` / `identity_disconnected` lifecycle.
- `create_character` + `spawn_character` with the checks above.

**Refactor:**
- Extract validation helpers (name normalize/validate, ownership guard, zone lookup).
- Write `SpawnAudit` on every rejection.
- Add indexes (`owner`, `zone_id`) and the `name` uniqueness constraint.
- Document reducer contracts; update `docs/03` if signatures drift.

## Acceptance Criteria

- [ ] Tables defined: `Player`, `Character`, `Position`, `Zone` (+ `SpawnAudit`).
- [ ] `init` seeds one `active` zone (Hearthvale) with a spawn point.
- [ ] Connecting upserts a single `Player` (`online = true`); reconnect does not duplicate.
- [ ] `create_character` enforces player-exists, name length/charset, uniqueness, per-identity cap; rejections return `Err` and are logged.
- [ ] `spawn_character` enforces ownership, existence, active-zone, not-already-spawned; sets `Position` to the zone spawn point only.
- [ ] The client cannot supply or alter spawn coordinates.
- [ ] Subscriptions defined for own `Player`/`Character`, active `Zone`, and in-zone spawned `Character` + `Position`.
- [ ] Abuse cases enumerated with mitigations.
- [ ] No implementation committed (design only).
