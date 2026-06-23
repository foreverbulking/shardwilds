---
name: economy-balance-reviewer
description: Review Shardwilds economy systems for faucets, sinks, bot incentives, crafting loops, and trade-route balance.
---

# Economy Balance Reviewer

Use this skill when designing or changing resources, crafting, gold, rewards, trade packs, farming, fishing, mining, dungeons, markets, or item progression.

## Goal
Keep the economy useful, understandable, and resistant to obvious abuse.

## Review areas

### Faucets
Identify what creates value:
- gold rewards
- item drops
- gathered materials
- dungeon loot
- farming harvests
- trade pack delivery

### Sinks
Identify what removes value:
- crafting ingredients
- repairs
- taxes/upkeep
- listing fees
- consumables
- travel costs
- failed/risky trade routes

### Bot incentives
Flag systems that reward unattended repetition:
- fixed-timer fishing
- uncapped safe mining
- safe gold loops
- instant craft profit
- endlessly farmable solo mobs

### Regional value
Check whether location matters:
- local resources
- distance multiplier
- danger multiplier
- demand multiplier
- route risk

### Item progression
Prefer:
- materials and recipes from dungeons
- crafted gear relevance
- cosmetic prestige
- bounded vertical power

Avoid early:
- huge gear inflation
- global auction house without logs
- full open gold transfers without controls

## Output format
```md
# Economy Review: <System>

## Summary
## Faucets
## Sinks
## Abuse/Bot Risks
## Balance Recommendations
## Required Telemetry
## Suggested Acceptance Checks
```

## Balance principle
Every high-value safe faucet needs a limit, sink, cooldown, travel requirement, or risk.
