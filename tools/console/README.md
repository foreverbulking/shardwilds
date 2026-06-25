# Shardwilds Console

Local dev console for Shardwilds. Three tabs:

- **Kanban** — read/edit `docs/stories/*.md` as a 4-column board (Todo / In Progress / Review / Done).
- **Architecture** — auto-render `docs/03-architecture-by-phase.md` as a live Mermaid diagram.
- **API Runner** — list SpacetimeDB reducers from generated bindings, call them against local STDB.

## Setup

```bash
cd tools/console
pnpm install
```

Requires Node 20+ and pnpm.

## Run

```bash
pnpm dev
```

Serves on `http://localhost:5174`. Game client uses 5173 — both can run side-by-side.

For the API Runner tab, SpacetimeDB must be running on `http://localhost:3000`:

```bash
cd server
spacetime start
spacetime publish shardwilds
```

For the reducer list to populate, generated bindings must exist:

```bash
cd client
spacetime generate --lang typescript --out-dir src/module_bindings --module-path ../server
```

## Test

```bash
pnpm test
```

Runs parser + reducer-list + builder unit tests.

## Architecture

See `docs/superpowers/specs/2026-06-25-shardwilds-console-design.md` for full design.

Layout:

```
src/
  app/         tab shell + nav
  kanban/      Kanban tab (markdown-driven)
  architecture/ Architecture tab (Mermaid from docs)
  api-runner/  API Runner tab (STDB HTTP)
  lib/         shared utilities
  styles/      tailwind globals
  components/  shadcn-generated UI
```

## Troubleshooting

**Kanban shows "No stories"** — stories missing required frontmatter (`story_id`, `title`, `status`). Old stories from earlier phases lack these fields. Update the frontmatter or delete the file.

**Architecture diagram empty** — `docs/03-architecture-by-phase.md` has no `## Phase N` sections with `### `<TableName>`` headings. Add them.

**API Runner sidebar empty** — generated bindings missing at `client/src/module_bindings/`. Run `spacetime generate`.

**STDB call fails with CORS error** — STDB must allow the console origin. For local dev, set `cors_allow_origin = "http://localhost:5174"` in STDB config or use a proxy.