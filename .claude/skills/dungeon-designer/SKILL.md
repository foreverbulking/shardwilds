---
name: dungeon-designer
description: Design Shardwilds solo/co-op instanced dungeons with rooms, bosses, rewards, risks, and implementation stories.
---

# Dungeon Designer

Use this skill when designing instanced dungeons, boss fights, room layouts, dungeon rewards, or co-op mechanics.

## Dungeon design goals
Dungeons should support action combat and feed the sandbox economy.

Dungeons reward:
- crafting materials
- recipes
- cosmetics
- trophies
- trade goods
- story progress

Do not make dungeons the only source of progression.

## Dungeon template
```md
# Dungeon: <Name>

## Pitch
One paragraph.

## Player Count
Solo / 2-4 co-op / scalable.

## Target Duration
Minutes.

## Entry Requirements
Zone, level, item, quest, or none.

## Room Flow
1. Entrance teaching room
2. Combat room
3. Optional gathering side path
4. Miniboss or mechanic room
5. Boss room
6. Reward/exit

## Enemy Set
- Enemy name: role, attack, counterplay

## Boss
### Identity
### Mechanics
### Telegraphs
### Phases
### Failure states

## Rewards
- Common:
- Uncommon:
- Rare:
- Crafting recipes:
- Cosmetic:

## Server Systems
- Instance creation
- Party membership
- Enemy state
- Loot rules
- Exit rules

## Red Checks
- Failing acceptance tests/checks.

## Green Slice
- Smallest playable version.

## Refactor Targets
- AI cleanup
- room scripting
- loot table extraction
```

## Design rules
- Every enemy needs clear counterplay.
- Every boss attack needs readable telegraphing.
- Include at least one non-combat reward hook when possible.
- Keep first dungeon 8-12 minutes.
- Avoid complex puzzles in the first implementation.
