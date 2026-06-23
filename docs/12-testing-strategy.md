# Testing Strategy

## Testing Philosophy

Test the MMO through acceptance checks, reducer tests, client unit tests, and browser flows.

Use Red Green Refactor:

1. Write failing test/check.
2. Implement smallest working behavior.
3. Refactor safely.

## Test Types

### Server Reducer Tests

Use for:

- Ownership validation
- Movement validation
- Gathering rules
- Crafting rules
- Trade pack rules
- Combat damage rules

### Client Unit Tests

Use for:

- State store behavior
- Data mapping
- Utility functions
- Network adapter boundaries

### Playwright Tests

Use for:

- Page loads
- Login/name flow
- Basic UI flows
- Inventory display
- Chat input

### Manual Multiplayer Tests

Use for:

- Two browser tabs
- Remote player movement
- Chat visibility
- Position persistence
- Trade pack visibility

## M0 Acceptance Test

Manual test:

1. Start local SpacetimeDB.
2. Start Vite client.
3. Open browser tab A.
4. Create character A.
5. Open browser tab B.
6. Create character B.
7. Move A.
8. Confirm B sees A move.
9. Send chat from A.
10. Confirm B sees chat.
11. Refresh A.
12. Confirm name and position persist.

## Required Before Merge

- Tests or manual checks are documented.
- Existing tests pass.
- Security checks are reviewed for server reducers.
