# Development Phases

## Development Philosophy

Build Shardwilds through small vertical slices.

Each phase must produce player-visible value and technical proof. Do not build large systems in isolation.

Use the Red Green Refactor loop:

1. Red: define failing acceptance checks.
2. Green: build the smallest working version.
3. Refactor: clean, secure, document.
4. Red: define the next failing slice.

## Phase 0: Project Foundation

Goal: Create a safe solo-dev repo and AI-assisted workflow.

Deliverables:

- Monorepo structure
- Core documentation
- Claude project instructions
- Claude skills
- MCP setup
- Local SpacetimeDB hello world
- Local Vite hello world
- Asset folders
- Secrets policy

Exit criteria:

- Claude can read project docs.
- Local tools are installed.
- Repo has `client/`, `server/`, `docs/`, `assets/`, `prompts/`, `tools/`.
- No secrets are committed.

## Phase 1: Hearthvale Online

Goal: First multiplayer world slice.

Features:

- Browser client
- Third-person camera
- Local player movement
- SpacetimeDB connection
- Character creation/name
- Position persistence
- Remote player rendering
- Nameplates
- Local chat

Exit criteria:

- Two browser tabs can see each other move.
- Player name persists.
- Position updates are server-validated.
- Remote players interpolate smoothly enough for prototype.

## Phase 2: Gathering and Inventory

Goal: Add basic world interaction.

Features:

- Inventory table
- Item definitions
- Mining node
- Fishing spot
- Resource node respawns
- Server-generated yields
- Basic inventory UI

Exit criteria:

- Player can gather from a node.
- Server validates distance and cooldown.
- Items persist after refresh.
- Client cannot create items directly.

## Phase 3: Farming and Crafting

Goal: Add life-skill loop.

Features:

- Basic farm plot
- Plant seeds
- Growth timers
- Harvest crops
- Crafting station
- Recipes
- Ingredient validation

Exit criteria:

- Player can plant and harvest a crop.
- Player can craft an item from gathered materials.
- Server owns crafting outputs.

## Phase 4: Trade Pack Run

Goal: Prove sandbox economy loop.

Features:

- Trade pack recipe
- Trade pack entity
- Visible pack on player
- Movement slow while carrying
- Delivery NPC
- Gold/reputation reward

Exit criteria:

- Player can craft a pack, carry it, and deliver it.
- Pack state is server-owned.
- Reward is server-generated and logged.
- No teleport while carrying.

## Phase 5: Basic Action Combat

Goal: Add real-time PvE combat foundation.

Features:

- Basic attack
- One skill
- Enemy health
- Enemy hit reaction
- Cooldowns
- Damage numbers
- Server-validated range/damage

Exit criteria:

- Player can fight one creature.
- Server owns damage and death.
- Client only sends attack intent.

## Phase 6: Copperroot Dungeon

Goal: Add solo/co-op instancing.

Features:

- Instance creation
- Dungeon zone
- Party entry later
- Enemy rooms
- One boss
- Loot chest
- Return to open world

Exit criteria:

- Player can enter a dungeon instance and exit back to the open world.
- Dungeon state is isolated by instance ID.
- Rewards are server-generated.

## Phase 7: PvP Frontier

Goal: Add controlled risk.

Features:

- PvP zone flag
- Rare resource nodes
- Player death rules
- Dropped carried resources or trade packs
- Safe respawn

Exit criteria:

- PvP only works in enabled zones.
- Death/drop rules are server-owned.
- Players can clearly see danger zone status.

## Phase 8: Housing and Land

Goal: Add sandbox permanence.

Features:

- Housing plots
- Small house placement
- Storage chest
- Decoration slots
- Farm expansion

Exit criteria:

- Player can claim a plot in a designated area.
- House state persists.
- Storage is server-owned.

## Phase 9: Alpha Readiness

Goal: Prepare for external testers.

Features:

- Account flow
- Logs and observability
- Admin tools
- Basic moderation
- Backups
- Performance test
- Security review
- Wipe/reset tools

Exit criteria:

- External testers can join safely.
- Economy can be wiped/reset.
- Admin can inspect suspicious activity.
- Server can be redeployed with predictable steps.
