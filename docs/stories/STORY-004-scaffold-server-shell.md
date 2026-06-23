# Story ID

STORY-004

## Title

Scaffold SpacetimeDB Server Shell.

## Phase

Phase 0: Project Foundation.

## Epic

Server Foundation.

## User Story

As a developer,
I want a minimal SpacetimeDB Rust module that builds and publishes to a local server,
so that later stories can add server-authoritative tables and reducers on a working base.

## Acceptance Criteria

- [ ] `server/` is a SpacetimeDB Rust module (`Cargo.toml`, `src/lib.rs`).
- [ ] `spacetime build` compiles the module to wasm with no errors.
- [ ] `spacetime publish shardwilds --server local --yes` succeeds against a local instance.
- [ ] The `init` reducer runs and a table is created on publish (visible in logs).
- [ ] No gameplay: no inventory, movement, or combat reducers/tables.
- [ ] Local build/publish/dev commands are documented.

## Red Checks

What should fail before implementation?

- [ ] `server/` has only `.gitkeep`, no `Cargo.toml`.
- [ ] `spacetime build` has nothing to compile.
- [ ] `spacetime publish` has no module to upload.

## Green Implementation

Smallest implementation that satisfies the story:

- Scaffold with `spacetime init shardwilds --project-path server --lang rust --server-only --non-interactive`.
- Keep the generated hello-world module (`person` table; `init`, connect/disconnect, `add`, `say_hello`).
- Add the wasm target: `rustup target add wasm32-unknown-unknown`.

## Refactor Tasks

- [ ] Flatten the module from `server/spacetimedb/` to `server/` to match `docs/03-architecture-by-phase.md` (`server/src/lib.rs`).
- [ ] Set `spacetime.json` to local-first (`server: local`, `module-path: .`).
- [ ] Align `spacetime.local.json` database name to `shardwilds`.
- [ ] Remove non-Claude template cruft (`.cursor/`, `.windsurfrules`, `AGENTS.md`, copilot file); keep `server/CLAUDE.md` SpacetimeDB reference.
- [ ] Document local commands in `server/README.md`.

## Security Checks

- [ ] No secrets in module or config.
- [ ] Server owns all state (client never trusted) — established by architecture; no client-trusting reducers added.
- [ ] `ctx.sender` is the only identity source (no identity-as-argument) — to enforce in gameplay stories.
- [ ] Abuse cases reviewed: N/A — shell only, no gameplay reducers.

## Files Expected to Change

```txt
server/Cargo.toml
server/src/lib.rs
server/spacetime.json
server/spacetime.local.json
server/CLAUDE.md
server/README.md
docs/stories/STORY-004-scaffold-server-shell.md
```

## Manual Test Plan

1. `cd server`
2. (if needed) `export PATH="$HOME/.rustup/toolchains/stable-aarch64-apple-darwin/bin:$PATH"`
3. `spacetime build` — finishes successfully.
4. In another terminal: `spacetime start`.
5. `spacetime publish shardwilds --server local --yes` — creates/updates database `shardwilds`.
6. `spacetime call shardwilds add '"Hearthvale"' --server local` then `spacetime call shardwilds say_hello --server local`.
7. `spacetime logs shardwilds --server local` — shows `Hello, Hearthvale!` and `Hello, World!`.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
