# Shardwilds

Browser-based stylized sandbox action MMO.

**Status:** Phase 0 — Project Foundation. No playable build yet.

## Stack

- **Client:** Vite, React, TypeScript, React Three Fiber, Drei, Zustand
- **Server:** SpacetimeDB, Rust module, generated TypeScript bindings
- **Assets:** Blender, low-poly stylized GLB/GLTF
- **Tooling:** Claude Code with MCP (filesystem, git, GitHub, Blender, Playwright)

## Repository Layout

| Path | Purpose |
|------|---------|
| `client/` | Web client — not scaffolded yet (STORY-002) |
| `server/` | SpacetimeDB module — not scaffolded yet (STORY-003) |
| `assets/` | Art pipeline: `source/` → `raw/` → `processed/`; licenses in `licenses/` |
| `tools/` | Dev and build scripts |
| `docs/` | Design, architecture, process — start at `docs/00-project-index.md` |
| `docs/stories/` | Story backlog (template: `docs/15-story-template.md`) |
| `prompts/` | Reusable Claude prompts |
| `.claude/` | Claude Code settings and project skills |

## Getting Started

1. Copy the environment template and fill in values:
   ```bash
   cp .env.example .env
   ```
   `.env` is gitignored — never commit secrets.
2. Follow [`docs/13-local-dev-setup.md`](docs/13-local-dev-setup.md) for machine setup and tool installs.
3. MCP setup: [`docs/14-mcp-setup.md`](docs/14-mcp-setup.md).

## Documentation

Full index: [`docs/00-project-index.md`](docs/00-project-index.md).

Read order before any code change: `CLAUDE.md` → `docs/00-project-index.md` → relevant phase, architecture, and story docs.

## Current Build Target

**M0: Hearthvale Online** — first playable slice: local dev, multiplayer movement, nameplates, local chat, server-authoritative position validation, basic inventory, one mining node, one fishing spot, one crafting station, one trade pack route.
