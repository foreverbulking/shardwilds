# Technical Decisions

This document records important architecture decisions.

## ADR-001: Use SpacetimeDB for Early Prototype

Status: Accepted for M0-M3

Decision:

Use SpacetimeDB for the early prototype because it combines persistence, server-side reducers, real-time subscriptions, and generated client bindings.

Reasoning:

- Strong solo-dev leverage
- Good fit for server-authoritative reducers
- Good fit for persistent world state
- Less backend boilerplate
- LLM-friendly table/reducer patterns

Risk:

- Newer ecosystem
- Production scale needs validation
- High-frequency combat architecture needs checkpoint

Checkpoint:

Re-evaluate after M3: Trade Pack Run.

## ADR-002: Keep Network Abstraction Layer

Status: Accepted

Decision:

Client components must not call SpacetimeDB directly everywhere. Use a game network abstraction.

Reasoning:

- Reduces lock-in
- Keeps rendering separate from networking
- Easier testing
- Easier future migration

Example:

```txt
React component -> GameNetwork -> SpacetimeDB adapter
```

## ADR-003: Browser Is Untrusted

Status: Accepted

Decision:

All important gameplay truth must be server-owned.

Reasoning:

- Browser code can be modified
- WebSocket calls can be spoofed
- Automation is expected
- Economy and PvP require server authority

## ADR-004: Stylized Low-to-Mid Poly Assets

Status: Accepted

Decision:

Use stylized low-to-mid poly GLB/GLTF assets.

Reasoning:

- Browser-friendly
- Easier solo-dev asset pipeline
- Better performance
- Works with free asset packs
- Easier to keep a consistent look
