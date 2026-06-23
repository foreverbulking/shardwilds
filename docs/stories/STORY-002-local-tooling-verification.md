# Story ID

STORY-002

## Title

Local Tooling Verification.

## Phase

Phase 0: Project Foundation.

## Epic

Repository and Tooling Foundation.

## User Story

As a developer,
I want a single checklist that verifies all required local tools are installed and working on macOS Apple Silicon,
so that I can confirm my machine is ready before scaffolding the client or server.

## Acceptance Criteria

- [ ] `docs/setup-verification.md` exists.
- [ ] It includes version-check commands for: git, gh, node, pnpm, rustc, cargo, spacetime, blender, claude, uv.
- [ ] It includes an MCP server verification step (`claude mcp list`).
- [ ] It targets macOS Apple Silicon (architecture and Homebrew prefix checks).
- [ ] It installs nothing and modifies no code.

## Red Checks

What should fail before implementation?

- [ ] `docs/setup-verification.md` does not exist.
- [ ] No single place lists all tool-verification commands.

## Green Implementation

Smallest implementation that satisfies the story:

- Create `docs/setup-verification.md` with:
  - platform sanity checks (`uname -m`, `brew --prefix`),
  - a per-tool table of `--version` commands,
  - an MCP server section (`claude mcp list`),
  - a copy-paste "verify all" block,
  - a final checklist.

## Refactor Tasks

- [ ] Keep commands copy-paste runnable.
- [ ] Link to `13-local-dev-setup.md` (installs) and `14-mcp-setup.md` (MCP) instead of duplicating them.
- [ ] Note the Blender CLI fallback path on Apple Silicon.

## Security Checks

- [ ] No secrets in the doc.
- [ ] Read-only verification commands only; nothing installs or mutates state.
- [ ] Abuse cases reviewed: N/A — documentation only.

## Files Expected to Change

```txt
docs/setup-verification.md
docs/stories/STORY-002-local-tooling-verification.md
```

## Manual Test Plan

1. Open `docs/setup-verification.md`.
2. Run the "Verify All" block in a terminal.
3. Every tool prints a version; `claude mcp list` shows configured servers.
4. Any missing tool points back to `13-local-dev-setup.md`.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
