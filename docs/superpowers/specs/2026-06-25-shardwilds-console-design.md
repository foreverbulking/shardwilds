# Shardwilds Console — Design

Date: 2026-06-25
Status: Approved (verbal user approval; user said "build it" after Sections 1-3)
Owner: Solo dev

## Purpose

A local dev-only webapp that gives one developer (you) a single pane for the three things done most while building Shardwilds: managing story markdown, viewing the live architecture diagram, and calling SpacetimeDB reducers without leaving the browser.

## Scope

In scope (M0):

- React + Vite + TypeScript app at `tools/console/`.
- Three tabs: Kanban, Architecture, API Runner.
- Reads `docs/stories/*.md` and `docs/03-architecture-by-phase.md`.
- Calls SpacetimeDB reducers over local HTTP.
- Persists UI state to `localStorage`.
- Dev-only file writes via Vite middleware plugin (no production build path).

Out of scope (M0):

- Auth, multi-user, deployment, hosted mode.
- Diagram editing from UI (docs are source of truth).
- Tests beyond vitest smoke tests for parsers.
- CI/CD integration.
- Anything beyond the three tabs.

## Locked Decisions

| # | Question | Answer |
|---|----------|--------|
| 1 | Audience | Solo dev, no auth |
| 2 | Location | `tools/console/` |
| 3 | Tasks source | `docs/stories/*.md` markdown, populated later with user |
| 4 | Diagram source | Auto-parsed from docs, rendered with Mermaid |
| 5 | Backend | SpacetimeDB (per ADR-001, re-evaluate at M3) |
| 6 | API runner shape | STDB-specific tight UI (option B) |
| 7 | API runner auth | Defer; anonymous identity only |
| 8 | Diagram view | One big system graph (`graph TD`) |
| 9 | Stack | Vite + React 19 + TS + Zustand + shadcn/ui + mermaid + gray-matter + marked |
| 10 | Settings storage | `localStorage` |
| 11 | Dev workflow | Standalone Vite, port 5174, separate terminal |
| 12 | Scaffold pattern | Flat feature-first (option A) |

---

## Section 1 — Architecture & File Layout

```
tools/console/
  README.md                    setup, run, port, STDB config
  package.json                 vite, react 19, ts, zustand, shadcn,
                               mermaid, gray-matter, marked
  vite.config.ts               registers vite-plugin-console
  vite-plugin-console.ts       custom: stories CRUD, arch doc, reducers,
                               SSE file-watcher. dev-only middleware.
  tsconfig.json
  tailwind.config.ts
  components.json              shadcn config
  index.html
  src/
    main.tsx                   entry, mounts <App />
    app/
      App.tsx                  tab shell + nav
      TabNav.tsx               Kanban | Architecture | API Runner
      useActiveTab.ts          zustand store: active tab
    kanban/
      KanbanTab.tsx            tab container
      Board.tsx                4 columns, drag-drop
      Card.tsx                 collapsed card
      CardExpanded.tsx         expanded editor
      NewCardDialog.tsx        shadcn dialog for new story
      useStories.ts            load/parse/save hooks
      markdown.ts              frontmatter parse + serialize
      types.ts                 Story, Status, ColumnId
    architecture/
      ArchitectureTab.tsx      tab container
      DiagramView.tsx          mermaid wrapper + pan/zoom
      parser.ts                markdown -> GraphModel
      builder.ts               GraphModel -> mermaid syntax
      types.ts                 Node, Edge, GraphModel
    api-runner/
      ApiRunnerTab.tsx         tab container
      ReducerList.tsx          sidebar of STDB reducers
      ReducerForm.tsx          args form for selected reducer
      ResponseView.tsx         status, time, body
      useReducerCall.ts        fetch + state
      reducerList.ts           parse generated bindings -> list
      client.ts                fetch wrapper for STDB HTTP
      types.ts
    lib/
      http.ts                  typed fetch helper
      storage.ts               localStorage wrapper
      cn.ts                    shadcn class-name helper
    styles/
      globals.css              tailwind base + shadcn vars
```

**Cross-cutting:**

- App-wide state in `lib/storage.ts` (localStorage): active tab, last-selected reducer, STDB base URL.
- Each tab owns its parser/state. No cross-tab imports outside `lib/`.
- `gray-matter` parses YAML frontmatter from `docs/stories/*.md`.
- `marked` renders body markdown inside expanded cards.
- `mermaid` rendered via simple wrapper component (no extra lib).

**STDB adapter** lives in `api-runner/client.ts`. Wraps `spacetime call <db> <reducer> <args>` semantics over HTTP. Single swap point if backend changes.

**External touchpoints:**

- Reads: `../docs/stories/*.md`, `../docs/03-architecture-by-phase.md`, `../client/src/module_bindings/*.ts`.
- Writes: `../docs/stories/*.md` (kanban edits).
- Network: `http://localhost:3000` (configurable in settings).

---

## Section 2 — Kanban Tab

**Purpose.** Read `docs/stories/*.md` (frontmatter + body), display as 4-column board, edit in place, save back to disk.

**Why in-browser file writes?** Vite dev middleware plugin (`vite-plugin-console`, custom-built) lets browser write to project files in dev mode only. Production build = read-only. Console is dev-only by design.

**Markdown contract** (frontmatter schema):

```yaml
---
story_id: STORY-040
title: Design Player Tables
status: todo
phase: "Phase 4"
epic: "EPIC-040 Identity"
created_at: 2026-06-25
updated_at: 2026-06-25
order: 0
---
```

**Body** = free markdown. Rendered with `marked` inside expanded cards. Edit via textarea (no WYSIWYG).

**Columns** (hardcoded M0):

- Todo
- In Progress
- Review
- Done

**State machine:**

- `todo` -> `in-progress` (start)
- `in-progress` -> `review` (submit)
- `review` -> `in-progress` (revert) or `done` (accept)
- `done` -> `in-progress` (reopen)
- Any -> `todo` (kick back)

**Load flow:**

1. On mount, fetch `/api/console/stories`.
2. Plugin reads `docs/stories/*.md`, parses each with `gray-matter`.
3. Returns `Story[]` to client.
4. `useStories` hook sorts by column + `order`, exposes actions.

**Save flow:**

1. User edits title / body / status / order.
2. Debounced 500ms, then POST `/api/console/stories/:id`.
3. Plugin re-serializes frontmatter + body, writes file.
4. Optimistic UI update, rollback on error.

**Empty state.** Kanban starts empty. Placeholder copy: "No stories yet — drop your first STORY-XXX markdown in `docs/stories/`."

**File watcher.** Plugin watches `docs/stories/` for external edits. On change, push update to client via SSE. Console re-parses affected file.

**Out of scope M0:** comments, activity log, assignees, subtasks, cross-story linking, filtering/search, split-pane markdown preview.

---

## Section 3 — Architecture Tab

**Purpose.** Auto-generate one Mermaid `graph TD` from `docs/03-architecture-by-phase.md`. Diagram is always in sync with the source-of-truth doc.

**Parse strategy:**

```
docs/03-architecture-by-phase.md
  ↓ marked
AST
  ↓ custom walker
nodes: Client, Server, Tables[Player, Character, Position, Zone], Reducers[...]
edges: Client -> Server, Server -> Tables (read), Reducers -> Tables (write)
  ↓ builder.ts
graph TD mermaid syntax string
  ↓ <Diagram />
rendered SVG
```

**Node shapes:**

- `Client[Client]` — rectangle
- `Server[(SpacetimeDB)]` — cylinder
- `Tables[(Player)]` — cylinder
- `Reducers{{update_movement}}` — hexagon
- `Subscriptions>-->>]` — asymmetric

**Edge labels:**

- `Client -->|websocket| Server`
- `Server -->|read| Tables`
- `Reducers -->|write| Tables`
- `Server -->|subscribe| Client`

**Parser details:**

- Tables extracted from `### \`<TableName>\`` headings.
- Reducers from `### \`<reducer_name>(args)\`` headings.
- Edge hints from adjacent bullet lines.
- Phase sections become subgraphs (`subgraph Phase 1`).

**Render:**

- `DiagramView.tsx` wraps `<div ref={ref}>` + `mermaid.render(id, syntax)` inside `useEffect`.
- Re-renders on parse change.
- Pan/zoom via simple CSS transform drag.
- "Copy mermaid source" button.
- "Re-parse docs" button.

**File watcher.** Plugin watches `docs/03-architecture-by-phase.md`. On change, push new content via SSE. Client re-parses, re-renders.

**Empty state.** If Phase 1 section missing or unparseable, show error card with file path + parser hint.

**Manual override.** Add `tools/console/data/architecture-override.mmd` (Mermaid syntax string). If present, used instead of auto-parsed.

---

## Section 4 — API Runner Tab

**Purpose.** List SpacetimeDB reducers from generated bindings, render an args form per reducer, call the reducer, show response.

**Reducer discovery:**

- Read `client/src/module_bindings/` (generated STDB TypeScript bindings).
- Parse each reducer file to extract: name, args (name + type), return type.
- Populate `ReducerList.tsx` sidebar.
- Watch the bindings dir; re-parse on `spacetime generate` runs.

**ReducerList:**

- Sidebar list, filterable by name.
- Selecting a reducer loads `ReducerForm` with that reducer's args.

**ReducerForm:**

- One input per arg. Type inferred from bindings:
  - `string` -> text input
  - `number` -> number input
  - `boolean` -> checkbox
  - `Identity` -> text input with `0x...` validator
  - objects/arrays -> JSON textarea
- "Call" button. Disables on missing required args.
- Arg values stored in localStorage per-reducer (last-used wins).

**STDB call shape:**

```
POST {baseUrl}/v1/database/{dbName}/call/{reducerName}
Headers: Content-Type: application/json
Body: [arg1, arg2, ...]  // positional JSON array
```

Anonymous identity mode (M0): no auth header. STDB treats as anonymous principal.

**ResponseView:**

- HTTP status, latency in ms, response body (pretty-printed JSON).
- Copy as JSON button.
- Clear button.

**Settings panel:**

- Base URL (default `http://localhost:3000`).
- Database name (default `shardwilds`).
- Saved to localStorage.

**Out of scope M0:** saved request collections, response history, scripts/JS sandbox, multi-identity, SQL tab.

---

## Section 5 — Data Flow & State Management

**App-level state (Zustand):**

- `useActiveTab`: `'kanban' | 'architecture' | 'api-runner'`. Persisted to localStorage.
- `useSettings`: `{ baseUrl, dbName }`. Persisted to localStorage.

**Tab-level state:**

- Kanban: `useStories` hook owns `Story[]`, loading/error flags, CRUD actions. In-memory; reloads on mount and on file-change events.
- Architecture: `useGraph` hook owns parsed `GraphModel`, mermaid syntax string. Recomputes on file change.
- API Runner: `useReducerCall` owns `{ reducer, args, response, pending, error }`. Pure component state.

**File-watch protocol (SSE):**

- Plugin opens SSE endpoint `/api/console/events`.
- On file change in `docs/stories/` or `docs/03-architecture-by-phase.md`, server pushes `{ type: 'stories-changed' | 'arch-doc-changed', path: string }`.
- Client hook subscribes via `EventSource`, dispatches re-fetch.

**HTTP contract (plugin endpoints):**

```
GET    /api/console/stories              -> Story[]
GET    /api/console/stories/:id          -> Story
POST   /api/console/stories              -> Story  (create)
PUT    /api/console/stories/:id          -> Story  (update)
DELETE /api/console/stories/:id          -> {}    (delete file)

GET    /api/console/architecture-doc     -> string  (raw markdown)
GET    /api/console/reducers             -> ReducerDef[]
GET    /api/console/events               -> SSE stream
```

**Plugin module:** `tools/console/vite-plugin-console.ts`. Single file. Wires all endpoints + file watcher + SSE.

---

## Section 6 — Error Handling

**Categories:**

1. **File I/O errors** (read/write markdown): plugin returns `4xx`/`5xx` with JSON `{ error: string }`. Client shows toast, rolls back optimistic update.
2. **Parse errors** (frontmatter invalid, mermaid syntax invalid): client shows inline error card on the affected item. Rest of tab still works.
3. **STDB connection errors** (server down, wrong URL): API Runner shows connection error banner with retry button. Settings panel lets user fix URL.
4. **STDB call errors** (reducer rejected, schema mismatch): response view shows the error message verbatim. No retry — user must fix args.
5. **File watch errors** (SSE disconnects): auto-reconnect with exponential backoff (1s, 2s, 4s, max 30s). Status indicator in tab nav.

**Error boundaries:**

- Each tab wrapped in React error boundary. Tab crash doesn't kill the app — others stay usable.
- Unhandled errors logged to console + shown as toast.

**No silent failures.** Every error has a visible surface: toast, banner, inline card, or response view. Console is dev tool — surfacing problems is the whole point.

**Logging.** Browser console + optional `tools/console/logs/` dir for plugin-side errors. Per-request log line with timestamp, method, path, status, duration.

---

## Section 7 — Testing Strategy

**Scope of tests** (M0): parser units + plugin endpoint smoke tests. No E2E (Playwright overkill for dev tool).

**Unit (vitest):**

- `kanban/markdown.ts` — frontmatter parse round-trips. Missing fields default cleanly. Malformed YAML throws typed error.
- `architecture/parser.ts` — known doc produces known `GraphModel`. Empty doc returns empty model, not crash.
- `architecture/builder.ts` — `GraphModel` produces valid mermaid syntax (smoke: no `undefined` strings).
- `api-runner/reducerList.ts` — sample bindings file produces expected `ReducerDef[]`.

**Plugin smoke tests (vitest + supertest-fetch):**

- `GET /api/console/stories` returns 200 + array.
- `POST /api/console/stories` with valid payload writes file + returns 201.
- `POST` with invalid story_id returns 400 + JSON error.
- `GET /api/console/architecture-doc` returns markdown string.

**Manual checks (documented in `tools/console/README.md`):**

- Drop a story markdown into `docs/stories/`, watch it appear in Kanban.
- Edit story in console, see file change in `git status`.
- Modify `docs/03-architecture-by-phase.md`, watch diagram re-render.
- Call `ping` reducer, see success response.

**No tests for:**

- React components (low value, high maintenance for dev tool).
- Drag-drop interactions.
- Visual regression.
- STDB call outcomes (server's job to test, not console's).

---

## Build / Run

```bash
cd tools/console
pnpm install
pnpm dev    # serves on http://localhost:5174
```

**Requires:**

- SpacetimeDB server running on `http://localhost:3000` for API Runner tab.
- Generated bindings at `client/src/module_bindings/` for reducer list.

**Port choice:** 5174 (game client uses 5173 default).

---

## Stories (Red-Green-Refactor)

Implementation broken into stories. Order matters — each builds on previous.

**STORY-CONSOLE-001: Scaffold tools/console app**
- Red: `cd tools/console && pnpm dev` fails (no project).
- Green: minimal Vite React TS app, `pnpm dev` serves, shows placeholder.
- Refactor: install Tailwind + shadcn init + base globals.

**STORY-CONSOLE-002: Tab shell + nav**
- Red: app shows only "hello".
- Green: 3 tabs render, click switches active tab, persists to localStorage.
- Refactor: extract TabNav, useActiveTab hook.

**STORY-CONSOLE-003: Vite plugin (filesystem + stories endpoint)**
- Red: `GET /api/console/stories` returns 404.
- Green: returns `Story[]` from `docs/stories/*.md`.
- Refactor: typed errors, single source of truth for paths.

**STORY-CONSOLE-004: Kanban board UI (read-only)**
- Red: empty page in Kanban tab.
- Green: 4 columns render, story cards display from `/api/console/stories`.
- Refactor: Card component, status badges, epic tag pills.

**STORY-CONSOLE-005: Kanban edit + save**
- Red: edit does not persist.
- Green: title + status edits write back to file.
- Refactor: debounce, optimistic UI, rollback on error.

**STORY-CONSOLE-006: Architecture parser + builder**
- Red: parser returns empty on real doc.
- Green: parses Phase 1 into GraphModel + valid mermaid string.
- Refactor: typed errors, fallback for missing sections.

**STORY-CONSOLE-007: Architecture DiagramView + watcher**
- Red: no diagram visible.
- Green: `graph TD` renders, doc changes trigger re-render via SSE.
- Refactor: pan/zoom, copy-source button.

**STORY-CONSOLE-008: API Runner — reducer list**
- Red: empty sidebar.
- Green: reducers parsed from `client/src/module_bindings/`, sidebar populated, alphabetical.
- Refactor: filter input by reducer name.

**STORY-CONSOLE-009: API Runner — form + call**
- Red: select reducer -> blank.
- Green: form renders args, call returns response.
- Refactor: arg-type-aware inputs, response pretty-print.

**STORY-CONSOLE-010: Settings panel + polish**
- Red: base URL hardcoded.
- Green: settings dialog, persisted to localStorage, picked up by API Runner.
- Refactor: connection-status indicator, empty states, error toasts.

---

## Acceptance Criteria (overall)

- [ ] `cd tools/console && pnpm dev` starts server on port 5174.
- [ ] All three tabs render and switch without error.
- [ ] Kanban reads `docs/stories/*.md`, edits persist to disk.
- [ ] Architecture tab renders diagram from `docs/03-architecture-by-phase.md`.
- [ ] API Runner lists reducers from generated bindings, calls them against local STDB.
- [ ] Settings persist across browser refresh.
- [ ] No secrets committed (no `.env` in repo).
- [ ] No production build path required (dev-only).
- [ ] Vitest unit tests pass for parsers + plugin.
- [ ] README documents setup, run, troubleshooting.