---
name: pr-reviewer
description: Review Shardwilds diffs for correctness, security, architecture, tests, docs, and scope control before merge.
---

# PR Reviewer

Use this skill when reviewing uncommitted changes, a branch, or a pull request.

## Review priorities
1. Correctness
2. Server authority and security
3. Scope control
4. Tests and acceptance checks
5. Architecture consistency
6. Performance
7. Docs
8. Code style

## Dynamic context to request or inspect
- Current git diff
- Story or issue being implemented
- Related docs
- Test output

## Review checklist

### Scope
- Does this implement only the intended story?
- Are unrelated files changed?
- Did it add unnecessary abstractions?

### Correctness
- Does it handle failure cases?
- Are edge cases covered?
- Are names clear?

### Security
- Does any client code create authoritative game state?
- Are reducer validations complete?
- Are secrets absent?
- Are dangerous permissions avoided?

### Tests
- Were red checks added first?
- Do tests cover expected and rejected behavior?
- Are manual checks documented if automation is not ready?

### Architecture
- Client rendering separated from networking?
- SpacetimeDB reducers authoritative?
- Tables and client state model documented?

### Performance
- Any per-frame allocations?
- Any unnecessary React re-renders?
- Any unbounded subscriptions?

## Output format
```md
# PR Review: <Branch or Story>

## Verdict
Approve / Request changes / Block

## Must Fix
- ...

## Should Fix
- ...

## Nice to Have
- ...

## Security Notes
- ...

## Test Gaps
- ...

## Suggested Commit Message
<type(scope): summary>
```

## Rule
Block merges that allow browser-created value, bypass server validation, or commit secrets.
