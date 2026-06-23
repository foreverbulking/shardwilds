---
name: spacetime-reducer-builder
description: Design and implement SpacetimeDB tables and reducers with ownership, validation, tests, and anti-cheat checks.
---

# SpacetimeDB Reducer Builder

Use this skill when creating or modifying SpacetimeDB server tables, reducers, generated bindings, or server-authoritative game actions.

## Goal
Reducers are guarded action gates. Tables are authoritative world state. The browser is never trusted.

## Workflow
1. Read the relevant story and architecture docs.
2. Identify authoritative tables.
3. Define reducer input as player intent, not final truth.
4. Add validation before mutation.
5. Add logging for rejected or suspicious actions.
6. Add tests or acceptance checks before implementation.
7. Update generated bindings and docs.

## Mandatory checks for every reducer
- Caller identity owns or is allowed to affect the entity.
- Inputs are bounded and valid.
- Current entity state allows the action.
- Cooldowns, distances, and timing are checked server-side.
- Item, gold, XP, health, and trade-pack state changes are created only server-side.
- Failure returns a clear error without partial mutation.
- Suspicious attempts are logged if relevant.

## Common reducer patterns

### Movement
Validate:
- character ownership
- max speed based on elapsed time
- zone boundaries
- finite coordinates
- alive/not stunned state
- trade-pack slow modifier

Never trust:
- client speed
- client position without bounds
- client trade-pack state

### Gathering
Input should be `gather_node(node_id)` or equivalent.
Validate:
- node exists
- node is available
- player is close enough
- player has required tool if needed
- cooldown/channel time is valid
- inventory capacity if relevant

Server decides yield.

### Crafting
Input should be recipe/station intent.
Validate:
- recipe exists
- station is close enough
- required ingredients exist
- ingredients are consumed atomically
- output is created server-side

### Combat
Input should be ability intent.
Validate:
- cooldown
- resource cost
- range
- facing or target rules
- alive state
- PvP rules

Server calculates damage.

## Output format
When designing a reducer, provide:

```md
## Tables
- Table name, key, fields, indexes

## Reducer
- Name
- Inputs
- Server validations
- Mutations
- Events/logs
- Failure cases
- Tests
```

## Code style
- Prefer clear names over short names.
- Do not use single-character local names.
- Avoid abbreviations like `err`; use `error`.
- Keep reducers small and delegate validation helpers when useful.
