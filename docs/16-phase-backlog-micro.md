# Shardwilds Micro Phase Backlog

This backlog is designed for Claude Code and solo development. Every story must be small enough to complete in one focused session.

## Rule

Never ask Claude to build a full village, full zone, full combat system, full dungeon, or full economy in one story.

Every story should change a small number of files and produce one verifiable result.

## Red Green Refactor Format

Each story follows:

1. Red: define the missing behavior or failing check.
2. Green: implement the smallest working version.
3. Refactor: clean up, document, secure, and stop.
4. Next Red: define the next tiny story.

---

# Phase 0: Project Foundation

Goal: create the repo, docs, local setup, and safe Claude workflow before game code.

## EPIC-000: Repo Foundation

### STORY-001: Create Base Repo Folders

As a solo developer, I want a predictable repo structure so Claude knows where each kind of work belongs.

Tasks:
- Create `client/` if missing.
- Create `server/` if missing.
- Create `docs/` if missing.
- Create `assets/` if missing.
- Create `assets/source/`, `assets/raw/`, `assets/processed/`, `assets/licenses/`.
- Create `prompts/` if missing.
- Create `tools/` if missing.

Acceptance:
- All folders exist.
- Empty folders have `.gitkeep`.
- No app scaffold is created yet.

Red:
- Folder check fails before creation.

Green:
- Create only folders and `.gitkeep` files.

Refactor:
- Keep folder naming consistent.

### STORY-002: Create Environment Files

Tasks:
- Create `.env.example`.
- Create `.gitignore`.
- Add `.env`, `.env.local`, `node_modules`, `target`, `dist`, `.DS_Store`.

Acceptance:
- Secrets are ignored.
- `.env.example` is safe to commit.

### STORY-003: Create Setup Verification Doc

Tasks:
- Create `docs/setup-verification.md`.
- List commands for `git`, `gh`, `node`, `pnpm`, `rustc`, `cargo`, `spacetime`, `blender`, `claude`, `uv`.

Acceptance:
- User can manually verify tools.
- No installation is performed by Claude.

---

# Phase 1: Client Shell

Goal: get a boring browser app running before Three.js or multiplayer.

## EPIC-010: Minimal Client

### STORY-010: Scaffold Vite React TypeScript Client

Tasks:
- Scaffold Vite React TypeScript in `client/`.
- Use pnpm.
- Show text: `Shardwilds Dev Client`.

Acceptance:
- `pnpm dev` starts the client.
- Browser shows the dev client text.
- No Three.js added yet.

### STORY-011: Clean Default Client Files

Tasks:
- Remove unused Vite template assets.
- Keep minimal `App.tsx`.
- Keep minimal CSS.

Acceptance:
- App still runs.
- No unrelated dependencies.

### STORY-012: Add Client Folder Structure

Tasks:
- Create `client/src/game/`.
- Create `client/src/game/state/`.
- Create `client/src/game/network/`.
- Create `client/src/game/components/`.
- Create `client/src/game/systems/`.

Acceptance:
- Folders exist.
- No game logic yet.

---

# Phase 2: Three.js Visual Seed

Goal: render the smallest possible 3D scene.

## EPIC-020: Tiny 3D Scene

### STORY-020: Add React Three Fiber Dependencies

Tasks:
- Add `three`, `@react-three/fiber`, `@react-three/drei`.
- Do not add physics.
- Do not add assets.

Acceptance:
- Dependencies install.
- App still runs.

### STORY-021: Render Empty 3D Scene

Tasks:
- Add a canvas.
- Add camera.
- Add ambient light.
- Add directional light.
- Add one ground plane.

Acceptance:
- Browser shows a flat ground plane.
- No player yet.
- No village yet.

### STORY-022: Add One Placeholder Player Object

Tasks:
- Add one local player placeholder using simple geometry.
- Use a sphere head and capsule/cylinder body.
- No movement yet.

Acceptance:
- One player placeholder appears at origin.
- No networking.
- No animation.

### STORY-023: Add Camera Follow Stub

Tasks:
- Add a camera rig that points at the player placeholder.
- Do not add full controls yet.

Acceptance:
- Camera frames the placeholder player.

### STORY-024: Add Basic WASD Movement Locally

Tasks:
- Move the placeholder player with WASD.
- Keep movement client-only.
- No server connection yet.

Acceptance:
- Player moves on the plane.
- Movement is simple and readable.

---

# Phase 3: Server Shell

Goal: create a working SpacetimeDB module without game systems.

## EPIC-030: SpacetimeDB Foundation

### STORY-030: Scaffold SpacetimeDB Rust Module

Tasks:
- Create minimal Rust SpacetimeDB module in `server/`.
- Add build instructions.
- Add no gameplay tables yet.

Acceptance:
- Module builds locally.

### STORY-031: Add First Health Reducer

Tasks:
- Add a harmless reducer like `ping`.
- Return/log basic confirmation.

Acceptance:
- Client or CLI can invoke a simple reducer.

### STORY-032: Generate TypeScript Bindings

Tasks:
- Generate client bindings from the server module.
- Put generated output in the agreed location.
- Document generation command.

Acceptance:
- Bindings exist.
- Client compile is not broken.

---

# Phase 4: Multiplayer Presence

Goal: one player can exist in server state.

## EPIC-040: Identity and Spawn

### STORY-040: Design Player and Character Tables

Tasks:
- Create design doc only.
- Define `Player`, `Character`, and `Position` tables.
- Define ownership rules.

Acceptance:
- No code changes.
- Security checks are listed.

### STORY-041: Implement Player Table

Tasks:
- Add `Player` table.
- Add reducer to create or update player record.
- Validate caller identity.

Acceptance:
- Player record is server-created.
- Client cannot spoof identity.

### STORY-042: Implement Character Table

Tasks:
- Add `Character` table.
- Add reducer to create one starter character.
- Enforce owner identity.

Acceptance:
- Character belongs to caller.
- Duplicate starter character is rejected or handled safely.

### STORY-043: Implement Position Table

Tasks:
- Add `Position` table.
- Add spawn position for character.
- No movement updates yet.

Acceptance:
- Character has a server-owned spawn position.

### STORY-044: Client Connects to SpacetimeDB

Tasks:
- Add network adapter.
- Connect to local SpacetimeDB.
- Do not render remote players yet.

Acceptance:
- Client can connect locally.
- Connection status appears in dev UI.

### STORY-045: Subscribe to Own Character

Tasks:
- Subscribe to current player's character and position.
- Store data in Zustand.

Acceptance:
- Client store receives own character data.

---

# Phase 5: Server-Validated Movement

Goal: move one player with server validation.

## EPIC-050: Movement

### STORY-050: Design Movement Reducer

Tasks:
- Create design doc only.
- Define movement input, speed limits, ownership checks, and rejection reasons.

Acceptance:
- No code yet.

### STORY-051: Implement Basic Movement Reducer

Tasks:
- Add `update_movement` reducer.
- Validate owner.
- Validate max speed.
- Reject invalid coordinates.

Acceptance:
- Valid movement updates position.
- Impossible movement is rejected.

### STORY-052: Send Movement from Client

Tasks:
- Client sends movement updates at a limited interval.
- Keep local movement visual simple.

Acceptance:
- Position updates server-side.
- Rate is limited.

### STORY-053: Reconcile Local Position

Tasks:
- If server position differs too much, snap or correct local player.

Acceptance:
- Teleport attempts are corrected.

### STORY-054: Render Remote Player Placeholders

Tasks:
- Subscribe to other positions in the same zone.
- Render other players as simple placeholders.

Acceptance:
- Two browser tabs can see each other.

---

# Phase 6: Tiny World Dressing

Goal: add one tiny visual object at a time. No village.

## EPIC-060: Micro Environment Props

### STORY-060: Add One Campfire Placeholder

Tasks:
- Add a simple campfire made from primitive geometry.
- Place it near spawn.
- No interaction.

Acceptance:
- One campfire appears near spawn.
- No houses.
- No village.
- No asset download required.

### STORY-061: Add One Tree Placeholder

Tasks:
- Add one low-poly tree from primitives or a single GLB if already available.
- Place it away from spawn.

Acceptance:
- One tree appears.
- No forest.

### STORY-062: Add One Rock Placeholder

Tasks:
- Add one rock object.
- Place it near the tree.

Acceptance:
- One rock appears.
- No resource logic.

### STORY-063: Add One Copper Node Placeholder

Tasks:
- Add one copper node visual.
- Use primitive geometry or one GLB.
- No gathering yet.

Acceptance:
- One copper node appears.
- It has a clear name in code.

### STORY-064: Add One Fishing Spot Placeholder

Tasks:
- Add one small pond or water plane.
- Add one marker for fishing spot.
- No fishing logic.

Acceptance:
- One fishing spot is visible.

### STORY-065: Add One Crafting Table Placeholder

Tasks:
- Add one crafting table visual.
- No interaction.

Acceptance:
- One crafting table appears.

### STORY-066: Add One Signpost Placeholder

Tasks:
- Add one signpost near spawn.
- Show placeholder label `Hearthvale Camp`.

Acceptance:
- One signpost appears.

### STORY-067: Arrange Micro Camp Layout

Tasks:
- Move existing single props into a small readable camp layout.
- Do not add new object types.

Acceptance:
- Spawn, campfire, tree, rock, node, pond, table, and sign are arranged clearly.
- Still no village.

---

# Phase 7: Chat

Goal: add tiny social feature.

## EPIC-070: Local Chat

### STORY-070: Design Chat Table and Reducer

Tasks:
- Define chat table.
- Define message limits.
- Define anti-spam rules.

Acceptance:
- Design doc only.

### STORY-071: Implement Chat Message Table

Tasks:
- Add chat table.
- Add send chat reducer.
- Validate max length and rate limit.

Acceptance:
- Server stores chat messages.

### STORY-072: Add Minimal Chat UI

Tasks:
- Add text input.
- Add message list.
- Connect to chat reducer.

Acceptance:
- Two tabs can chat.

---

# Phase 8: First Gathering Slice

Goal: mine one copper node.

## EPIC-080: Mining

### STORY-080: Design Resource Node Table

Tasks:
- Define `ResourceNode` table.
- Define distance checks.
- Define respawn/cooldown.

Acceptance:
- Design doc only.

### STORY-081: Implement One Server Copper Node

Tasks:
- Add one seeded copper node.
- Expose via subscription.
- No gathering yet.

Acceptance:
- Client can see server-defined node.

### STORY-082: Implement Gather Copper Reducer

Tasks:
- Add `gather_resource(node_id)`.
- Validate distance.
- Validate availability.
- Grant item server-side.

Acceptance:
- Valid gather grants copper.
- Invalid distance is rejected.

### STORY-083: Add Gather UI Prompt

Tasks:
- Show `Press E to Mine` near copper node.
- Call gather reducer.

Acceptance:
- Player can mine one node.

---

# Phase 9: First Inventory Slice

Goal: show one item gained from mining.

## EPIC-090: Inventory

### STORY-090: Design Inventory Item Table

Tasks:
- Define `InventoryItem` table.
- Define stack rules.
- Define item grant ledger.

Acceptance:
- Design doc only.

### STORY-091: Implement Inventory Table

Tasks:
- Add inventory table.
- Server can add copper item from gathering.

Acceptance:
- Copper appears in server state.

### STORY-092: Add Minimal Inventory UI

Tasks:
- Show item name and quantity.
- No drag/drop.
- No equipment.

Acceptance:
- Mined copper appears in UI.

---

# Phase 10: First Crafting Slice

Goal: turn copper into one crafted item.

## EPIC-100: Crafting

### STORY-100: Design One Recipe

Tasks:
- Define recipe: `Copper Charm`.
- Define required material: copper x3.
- Define crafting station requirement.

Acceptance:
- Design doc only.

### STORY-101: Implement Craft Reducer

Tasks:
- Add `craft_item(recipe_id)`.
- Validate ingredients.
- Remove ingredients server-side.
- Add output server-side.

Acceptance:
- Copper x3 becomes Copper Charm.
- Client cannot choose arbitrary output.

### STORY-102: Add Minimal Crafting UI

Tasks:
- Show one recipe at crafting table.
- Add craft button.

Acceptance:
- Player crafts Copper Charm.

---

# Phase 11: First Trade Pack Slice

Goal: create and deliver one trade pack.

## EPIC-110: Trade Pack

### STORY-110: Design Trade Pack Entity

Tasks:
- Define `TradePack` table.
- Define carried/dropped/delivered states.
- Define speed penalty.

Acceptance:
- Design doc only.

### STORY-111: Create Trade Pack Reducer

Tasks:
- Add `create_trade_pack(recipe_id)`.
- Server creates pack entity.
- Pack attaches to carrier.

Acceptance:
- Pack exists server-side.
- Pack is visible in subscription.

### STORY-112: Render Pack on Player

Tasks:
- Add simple cube/backpack visual to carrier.
- No delivery yet.

Acceptance:
- Other players can see the pack.

### STORY-113: Apply Carry Speed Penalty

Tasks:
- Movement reducer checks carried pack.
- Max speed is reduced.

Acceptance:
- Carrying player moves slower.

### STORY-114: Add Delivery Marker

Tasks:
- Add one delivery marker in the same small map.
- No reward yet.

Acceptance:
- Delivery marker is visible.

### STORY-115: Deliver Trade Pack

Tasks:
- Add `deliver_trade_pack(pack_id)` reducer.
- Validate carrier.
- Validate distance.
- Mark delivered.
- Grant simple reward server-side.

Acceptance:
- Pack can be delivered.
- Reward is logged.

---

# Claude Execution Rule

Claude must implement only one story per prompt unless explicitly told otherwise.

Use this prompt pattern:

```txt
Read:
- CLAUDE.md
- docs/00-project-index.md
- docs/10-definition-of-done.md
- docs/16-phase-backlog-micro.md

Implement STORY-XXX only.

Rules:
- Do not implement future stories.
- Do not add extra systems.
- Follow Red Green Refactor.
- Stop after files changed, commands run, and verification steps.
```
