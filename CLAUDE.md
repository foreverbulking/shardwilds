# CLAUDE.md

## Project

Shardwilds is a browser-based stylized sandbox action MMO.

## Current Goal

Build M0: Hearthvale Online.

The first playable slice must support:
- local development
- multiplayer movement
- nameplates
- local chat
- server-authoritative position validation
- basic inventory
- one mining node
- one fishing spot
- one crafting station
- one trade pack route

## Stack

Client:
- Vite
- React
- TypeScript
- React Three Fiber
- Drei
- Zustand

Server:
- SpacetimeDB
- Rust module
- TypeScript generated bindings

Assets:
- Blender
- GLB/GLTF
- low-poly stylized fantasy assets

AI Tooling:
- Claude Code
- MCP filesystem
- MCP git
- MCP GitHub
- MCP Blender
- MCP Playwright

## Coding Rules

- Use readable names.
- Do not use single-character variable names.
- Do not shorten names like `err`; use `error`.
- Keep networking, rendering, and state separate.
- Never trust the browser.
- All gameplay truth belongs server-side.
- Do not create inventory, gold, combat results, trade packs, or crafting output on the client.
- Do not commit secrets.
- Update docs when architecture changes.

## Red Green Refactor

For every story:

1. Red: write failing tests or acceptance checks.
2. Green: implement the smallest working version.
3. Refactor: clean up, secure, document.
4. Red: define the next failing slice.

## Required Before Any Code Change

Claude must:
- identify the story being worked on
- list files expected to change
- check relevant docs
- avoid unrelated edits
- update docs if behavior changes

## Current Phase

Phase 0: Project Foundation.
