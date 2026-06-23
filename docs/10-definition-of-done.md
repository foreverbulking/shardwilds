# Definition of Done

A story is done only when all relevant sections below are satisfied.

## Product

- The feature satisfies the story acceptance criteria.
- The feature fits the current phase.
- No unrelated scope was added.
- The player-facing behavior is clear.

## Code

- Code is readable and modular.
- Naming is clear.
- No single-character local names.
- No shortened names like `err`.
- No secrets are committed.
- Client/server boundaries are respected.
- No important gameplay truth is client-authoritative.

## Tests

- Acceptance checks exist.
- Relevant unit tests exist where practical.
- Manual test steps are documented.
- Existing tests pass.

## Security

- Reducers validate caller identity.
- Server owns rewards and state changes.
- Abuse cases are considered.
- Suspicious behavior is logged where relevant.
- Economy-impacting changes have ledger entries where needed.

## Documentation

- Changed behavior is documented.
- Architecture docs are updated if needed.
- Story status is updated.
- New commands are added to setup docs.

## AI Workflow

- Claude summarized files changed.
- Claude summarized tests run.
- Claude listed risks or follow-ups.
- Human reviewed the diff before merge.
