---
name: red-green-refactor-runner
description: Run Shardwilds work through red-green-refactor with acceptance checks, implementation, cleanup, docs, and next red.
---

# Red Green Refactor Runner

Use this skill when implementing any Shardwilds story.

## Goal
Prevent vague agent work. Every change starts with a failing check, reaches the smallest working version, then cleans up before expanding.

## Workflow

### 1. Confirm story scope
- Identify the exact story ID and title.
- List files likely to change.
- List files explicitly out of scope.

### 2. Red
Create failing checks before implementation.
Use the best available form:
- unit test
- reducer test
- Playwright flow
- type-level test
- documented manual acceptance check

Do not skip Red unless the user explicitly says to spike.

### 3. Green
Implement the smallest working version.
Rules:
- Do not touch unrelated systems.
- Do not polish.
- Do not add future abstractions unless required.
- Keep server authority intact.

### 4. Refactor
Clean only after Green.
- remove duplication
- clarify names
- extract helpers
- update docs
- add logging if relevant
- run formatter/linter/tests

### 5. Next Red
End by proposing the next failing check/story.

## Required final report
```md
## Story
## Red checks added
## Green implementation
## Refactor completed
## Tests run
## Files changed
## Risks left
## Next Red
```

## Rules
- Prefer clear names.
- Do not use single-character variable names.
- Do not abbreviate important names.
- If tests cannot be automated yet, write explicit manual checks.
