---
name: r3f-component-builder
description: Build React Three Fiber components for Shardwilds while separating rendering, state, input, and networking.
---

# React Three Fiber Component Builder

Use this skill when building or changing the Shardwilds browser client rendering, scene components, controls, animation, or GLB usage.

## Goal
Create performant, readable R3F components that do not mix rendering with authoritative game logic.

## Architecture rule
Use this flow:

```txt
SpacetimeDB subscriptions -> client game store -> R3F components
Input -> local prediction -> reducer intent calls
```

Do not call reducers directly from deeply nested mesh components unless the component is explicitly an interaction boundary.

## Preferred folders
```txt
client/src/game/
  components/
  controls/
  effects/
  assets/
  net/
  state/
  systems/
  ui/
```

## Component rules
- Keep rendering components presentational when possible.
- Put input handling in controls or systems.
- Put interpolation in systems or hooks.
- Use Zustand or equivalent for derived client state.
- Use `useGLTF` and `useAnimations` for GLB assets.
- Dispose or reuse resources where needed.
- Avoid unnecessary per-frame allocations.
- Avoid putting server truth in React local component state.

## Performance rules
- Prefer instancing for repeated props.
- Keep first assets low-poly.
- Avoid heavy post-processing early.
- Avoid real-time shadows until performance budget is known.
- Use animation LOD for remote players later.

## Output format
For each component/system, include:

```md
## Purpose
## Inputs
## State dependencies
## Events/reducer calls
## Performance risks
## Tests or visual checks
```

## Visual direction
Shardwilds is stylized anime fantasy:
- bright colors
- readable silhouettes
- slightly chibi proportions
- oversized weapons
- expressive animations
- simple flashy VFX

## Code style
- Use clear names.
- Do not use single-character variable names.
- Do not abbreviate names unnecessarily.
- Prefer explicit props interfaces.
