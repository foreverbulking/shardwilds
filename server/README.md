# Shardwilds Server (SpacetimeDB module)

Server-authoritative game module: Rust compiled to WebAssembly, run inside SpacetimeDB. The browser is hostile — all gameplay truth lives here (see [`../docs/05-security-and-anticheat.md`](../docs/05-security-and-anticheat.md)).

Currently a hello-world shell: a `person` table plus `init`, `client_connected`, `client_disconnected`, `add`, `say_hello`, and a `ping` health-check reducer. No gameplay yet.

## Prerequisites

- SpacetimeDB CLI — `spacetime --version`
- Rust via **rustup**, with the wasm target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- Optional: `wasm-opt` (binaryen) for smaller/faster modules.

> **Toolchain note (this machine):** the conflicting Homebrew `rust` (whose compiler lacked the wasm target) was removed, and `~/.zshrc` puts the rustup stable toolchain first on `PATH`:
> ```bash
> export PATH="$HOME/.rustup/toolchains/stable-aarch64-apple-darwin/bin:$PATH"
> ```
> `spacetime build` now works in any fresh shell — no manual setup. If a future `rustup` change renames the toolchain dir, update that line.

## Local Commands

Run from `server/`.

```bash
# 1. Start a local SpacetimeDB instance (separate terminal, keep running)
spacetime start

# 2. Build the module to wasm
spacetime build

# 3. Publish to the local server
spacetime publish shardwilds --server local --yes

# Dev loop: auto-rebuild + republish on change
spacetime dev

# Inspect
spacetime logs shardwilds --server local              # module logs
spacetime sql  shardwilds "SELECT * FROM person"      # query a table
spacetime call shardwilds ping --server local         # health check (logs "ping from <identity>")
spacetime call shardwilds say_hello --server local    # invoke a reducer
```

Config:
- `spacetime.json` — `server: local`, `module-path: .` (local-first for Phase 0; pass `--server maincloud` for cloud later).
- `spacetime.local.json` — local database name (`shardwilds`).

## Client Bindings

Generated TypeScript bindings live in `../client/src/module_bindings/` (committed). Regenerate after changing tables/reducers:

```bash
spacetime generate --lang typescript --out-dir ../client/src/module_bindings --module-path .
```

Client needs the matching SDK: `spacetimedb` (currently `2.6.0`) in `client/package.json`.

See [`CLAUDE.md`](CLAUDE.md) in this folder for SpacetimeDB concepts, CLI, and Rust SDK reference.
