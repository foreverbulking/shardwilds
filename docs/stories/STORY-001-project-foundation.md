# Story ID

STORY-001

## Title

Project Foundation — repository structure.

## Phase

Phase 0: Project Foundation.

## Epic

Repository and Tooling Foundation.

## User Story

As a developer,
I want a clear repository structure with a README, an environment contract, asset-pipeline folders, and correct ignore rules,
so that every future story builds on a consistent foundation and no secrets are committed.

## Acceptance Criteria

- [ ] `README.md` exists and explains the project, stack, layout, and how to start.
- [ ] `.env.example` documents required environment variables with no real values.
- [ ] `.env` is ignored by git.
- [ ] Asset pipeline folders exist: `assets/source/`, `assets/raw/`, `assets/processed/`, `assets/licenses/`.
- [ ] `assets/licenses/ASSET_SOURCES.md` exists and explains how asset licensing is tracked.
- [ ] `tools/`, `client/`, and `server/` exist (kept via `.gitkeep`).
- [ ] No Vite, SpacetimeDB, or dependencies were added.
- [ ] No unrelated docs were changed.

## Red Checks

What should fail before implementation?

- [ ] `README.md` does not exist.
- [ ] `.env.example` does not exist.
- [ ] `.gitignore` does not ignore `.env`.
- [ ] `assets/source/`, `assets/raw/`, `assets/processed/`, `assets/licenses/` do not exist.
- [ ] `assets/licenses/ASSET_SOURCES.md` does not exist.

## Green Implementation

Smallest implementation that satisfies the story:

- Create `README.md` (project intro, stack, layout, getting started, docs links).
- Create `.env.example` (GitHub token + SpacetimeDB placeholders, empty values).
- Create asset folders via `.gitkeep`: `source/`, `raw/`, `processed/`.
- Create `assets/licenses/ASSET_SOURCES.md` (pipeline + rules + empty registry).
- Update `.gitignore` to ignore `.env*` and `.DS_Store`.
- Leave existing `.gitkeep` files in `client/`, `server/`, `tools/`, `assets/` untouched.

## Refactor Tasks

- [ ] Keep README minimal and skimmable; link to docs instead of duplicating them.
- [ ] Keep `ASSET_SOURCES.md` to pipeline, rules, and a single registry table.
- [ ] No duplication between README and existing docs.
- [ ] Defer the package-manager choice (npm vs pnpm) to setup docs, not README.

## Security Checks

- [ ] `.env` is gitignored; no real secrets committed.
- [ ] `.env.example` contains placeholders only.
- [ ] No client/server authority introduced (no gameplay code in this story).
- [ ] Abuse cases reviewed: N/A — repository scaffolding only.

> Note: a GitHub token currently sits in plaintext in `.claude/settings.json` (gitignored, not tracked, not in history). Out of scope for this story; tracked as a follow-up to rotate and move to an env reference.

## Files Expected to Change

```txt
README.md
.env.example
.gitignore
assets/source/.gitkeep
assets/raw/.gitkeep
assets/processed/.gitkeep
assets/licenses/ASSET_SOURCES.md
docs/stories/STORY-001-project-foundation.md
```

## Manual Test Plan

1. Run `ls README.md .env.example assets/licenses/ASSET_SOURCES.md` — all three list without error.
2. Run `ls assets/source/.gitkeep assets/raw/.gitkeep assets/processed/.gitkeep` — all three list without error.
3. Run `cp .env.example .env`, then `git status --porcelain` — `.env` does not appear (ignored).
4. Run `git status` — only the intended new/changed files appear; no Vite/SpacetimeDB/dependency files.

## Done Checklist

- [ ] Acceptance criteria satisfied
- [ ] Tests or manual checks documented
- [ ] Security reviewed
- [ ] Docs updated
- [ ] Diff reviewed by human
