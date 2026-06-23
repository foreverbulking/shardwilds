---
name: anticheat-reviewer
description: Review Shardwilds features for browser trust issues, exploits, botting, reducer abuse, and economy manipulation.
---

# Anti-Cheat Reviewer

Use this skill before merging any feature that touches game state, economy, movement, combat, PvP, crafting, gathering, trade packs, or subscriptions.

## Threat model
The browser is hostile. Players can modify JavaScript, replay WebSocket calls, spoof reducer inputs, automate clicks, inspect packets, and run bots.

## Review checklist

### Server authority
- Does the server own final truth?
- Is the client only sending intent?
- Can the client create items, gold, XP, damage, or position truth?

### Reducer validation
- Identity and ownership checked?
- Entity exists and is in the right state?
- Inputs bounded and sanitized?
- Timing/cooldowns validated server-side?
- Distance/range/zone checks server-side?
- Failure is atomic?

### Movement
- Speed validation?
- Teleport prevention?
- Boundary validation?
- Trade-pack speed modifier enforced server-side?
- Dead/stunned/rooted state enforced?

### Combat
- Cooldown and animation lock checked?
- Range/facing/line rules checked?
- PvP rules checked?
- Damage calculated server-side?

### Economy
- Item/gold creation logged?
- No client-defined outputs?
- Duplication risk checked?
- Atomic inventory mutations?
- Bot incentive reviewed?

### Gathering/fishing/farming
- Node/crop ownership or availability checked?
- Cooldowns and growth timers server-side?
- Random yield server-side?
- Repetition/bot signals logged?

### Trade packs
- Pack is server entity?
- Carrier state enforced?
- No teleport while carried?
- Death/drop/delivery rules server-side?

### Observability
- Rejected reducer calls logged?
- Suspicious behavior tracked?
- Gold/item ledger updated?

## Output format
```md
# Anti-Cheat Review: <Feature>

## Verdict
Pass / Pass with changes / Block

## Critical Issues
- ...

## Medium Issues
- ...

## Botting/Economy Risks
- ...

## Required Fixes
- ...

## Suggested Tests
- ...
```

## Rule
Block the change if a browser client can directly create value or bypass risk.
