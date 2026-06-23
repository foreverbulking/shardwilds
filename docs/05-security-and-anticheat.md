# Security and Anti-Cheat

## Core Rule

The browser is hostile.

The client may:

- Render
- Animate
- Collect input
- Predict movement
- Display UI
- Play VFX

The server must own:

- Position truth
- Inventory
- Gold
- Resource gathering
- Crafting outputs
- Trade packs
- Combat damage
- Cooldowns
- Dungeon rewards
- PvP outcomes

## Reducer Rules

Every SpacetimeDB reducer must validate:

- Caller identity
- Character ownership
- Position/range
- Cooldowns
- Item requirements
- Zone rules
- Rate limits where relevant

## Never Accept From Client

Never accept these as truth from the client:

- Damage amount
- Item grants
- Gold grants
- Crafting result
- Gathering yield
- Trade pack delivery success
- PvP kill result
- Dungeon reward result
- Position teleport without validation

## Movement Checks

Movement reducers must check:

- Character ownership
- Max speed
- Elapsed time
- Zone bounds
- Valid coordinates
- Trade pack slow modifier
- Root/stun/dead state later

## Combat Checks

Combat reducers must check:

- Character ownership
- Ability cooldown
- Target validity
- Range
- Facing or aim where needed
- Zone PvP rules
- Server-generated damage

## Economy Checks

Economy reducers must check:

- Ingredient ownership
- Item quantities
- Recipe validity
- Station distance
- Inventory capacity
- Server-created output
- Ledger entries for item/gold creation

## Required Logs

Log:

- Rejected movement
- Suspicious speed
- Failed ownership checks
- Item creation
- Item deletion
- Gold creation
- Trade pack creation
- Trade pack delivery
- PvP death
- Dungeon reward claim

## Botting Assumptions

Players may automate:

- Fishing
- Mining
- Farming
- Trade routes
- Dungeon runs
- Combat rotations

Design against bots by using:

- Server validation
- Rate limits
- Variable respawn timers
- Suspicion scoring
- Economic caps where needed
- Logs and admin review
