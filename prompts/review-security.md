# Security Review Prompt

Read:

- `CLAUDE.md`
- `docs/05-security-and-anticheat.md`
- Relevant changed files

Review for:

- Client-authoritative gameplay truth
- Missing identity checks
- Missing ownership checks
- Missing range/distance checks
- Missing cooldown checks
- Missing rate limits
- Item/gold creation without ledger
- Secrets committed accidentally
- Unsafe MCP/tool assumptions

Output:

- Blocking issues
- Non-blocking issues
- Suggested fixes
- Approval or rejection
