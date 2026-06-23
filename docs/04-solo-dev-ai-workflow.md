# Solo Dev AI Workflow

## Goal

Use LLMs to move faster without losing control of architecture, security, scope, or code quality.

## AI Roles

Use separate roles instead of asking one agent to do everything.

### Architect

Designs systems, data models, boundaries, and technical decisions.

### Implementer

Implements one story at a time.

### Security Reviewer

Checks browser trust, reducers, secrets, abuse paths, and logs.

### Game Designer

Checks player experience, scope, friction, and fun.

### Economy Reviewer

Checks item faucets, gold faucets, duping risk, bot incentives, and inflation.

### Asset Director

Writes asset briefs, validates style, and organizes Blender/GLB work.

### QA Tester

Writes acceptance tests, Playwright flows, and manual test plans.

### Refactorer

Improves structure only after green state.

## Story Workflow

For every story:

1. Create or select one story.
2. Ask Claude to read `CLAUDE.md` and relevant docs.
3. Ask Claude to list files expected to change.
4. Ask Claude to write Red checks.
5. Ask Claude to implement the smallest Green solution.
6. Ask Claude to refactor only related files.
7. Ask Claude to update docs.
8. Run tests.
9. Run security review.
10. Review diff manually.
11. Commit.

## Prompt Pattern

```txt
Implement STORY-000 only.

Read:
- CLAUDE.md
- docs/00-project-index.md
- docs/10-definition-of-done.md
- the story file

Rules:
- Start with Red checks.
- Implement the smallest Green solution.
- Do not touch unrelated files.
- Keep browser/client untrusted.
- Update docs if behavior changes.
- Summarize files changed and tests run.
```

## Branch Rules

Use one branch per story.

Examples:

```txt
story/001-repo-scaffold
story/012-movement-reducer
story/021-mining-node
```

## Commit Rules

Use small commits.

Examples:

```txt
docs: add project foundation docs
server: add character and position tables
client: render remote player nameplates
security: validate movement speed in reducer
```

## Claude Rules

Claude must not:

- Touch unrelated files.
- Add new libraries without explanation.
- Store secrets.
- Make client-authoritative gameplay logic.
- Skip docs for architecture changes.
- Implement future phases accidentally.

Claude should:

- Keep changes small.
- Explain assumptions.
- Add tests or acceptance checks.
- Summarize risks.
- Ask before large refactors.
