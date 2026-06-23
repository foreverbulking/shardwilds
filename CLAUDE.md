## Project

Shardwilds is a browser-based stylized sandbox action MMO.

## Stack

- Client: Vite, React, TypeScript, React Three Fiber, Drei, Zustand

- Server: SpacetimeDB Rust module

- Networking: SpacetimeDB subscriptions and reducers

- Assets: Blender, GLB/GLTF

- Terminal: bash on Windows 10 / WSL2

## Coding rules

- Prefer readable names.

- Do not use single-character variable names.

- Do not shorten names like `err`; use `error`.

- Keep code modular.

- Add tests before behavior changes.

- Never trust the browser.

- All economy, combat, inventory, trade, gathering, and movement truth belongs server-side.

- No API keys in code.

- Update docs when architecture changes.

## Red Green Refactor

For every story:

1. Red: write failing acceptance check or test.

2. Green: implement the smallest working version.

3. Refactor: clean, secure, document.

4. Red: define the next failing slice.
