---
name: game-story-writer
description: Turn Shardwilds design goals into epics, user stories, acceptance criteria, and solo-dev tasks.
---

# Game Story Writer

Use this skill when converting Shardwilds design ideas into actionable work items.

## Goal
Produce small, testable stories that support a solo developer using red-green-refactor.

## Required inputs
Ask for missing context only when blocked. Otherwise infer from existing docs.

Preferred context:
- Current phase
- Feature or system name
- Player-facing goal
- Technical constraints
- Security or economy risks

## Output format
Use this structure:

```md
# EPIC-XXX: <Epic Name>

## Intent
<Why this matters to the game.>

## Scope
### In scope
- ...

### Out of scope
- ...

## User Stories

### STORY-XXX: <Story Name>
As a <player/developer/admin>,
I want <capability>,
so that <benefit>.

#### Acceptance Criteria
- Given ... when ... then ...
- Given ... when ... then ...

#### Red Checks
- [ ] Failing test or acceptance check exists.
- [ ] Security/economy abuse case is named.

#### Green Tasks
- [ ] Smallest implementation task.
- [ ] Client task if needed.
- [ ] Server task if needed.
- [ ] Test task.

#### Refactor Tasks
- [ ] Remove duplication.
- [ ] Update docs.
- [ ] Add logging/observability if relevant.

#### Risks
- Gameplay:
- Technical:
- Security:
- Economy:
```

## Rules
- Keep stories small enough to finish in one focused session.
- Prefer vertical slices over layers.
- Every story must have acceptance criteria.
- Every story touching inventory, gold, combat, gathering, crafting, trade packs, PvP, or movement must include server-authority and abuse checks.
- Do not create vague tasks like "build combat". Split into concrete stories.
- Do not assume final art is needed for gameplay validation.

## Shardwilds vocabulary
Use the project terms:
- Hearthvale Online
- Farmstead
- Trade Pack Run
- Copperroot Dungeon
- Red Banner Frontier
- Green, Yellow, Red zone PvP
- SpacetimeDB reducers
- React Three Fiber client
- GLB assets
