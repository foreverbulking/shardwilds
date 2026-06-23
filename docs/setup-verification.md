# Setup Verification

Checklist to confirm local tooling is installed and working on **macOS, Apple Silicon**. This verifies an existing setup — it does **not** install anything. For installs, see [`13-local-dev-setup.md`](13-local-dev-setup.md).

## Platform Sanity

| Check | Command | Expected |
|-------|---------|----------|
| Architecture | `uname -m` | `arm64` |
| Homebrew prefix | `brew --prefix` | `/opt/homebrew` |

## Tools

Run each command. A version string means the tool is installed and on `PATH`.

| Tool | Command | Expected / Notes |
|------|---------|------------------|
| git | `git --version` | `git version 2.x` |
| gh | `gh --version` | GitHub CLI. Also run `gh auth status` — should show logged in. |
| node | `node --version` | `v20.x` or newer |
| pnpm | `pnpm --version` | `9.x` or newer |
| rustc | `rustc --version` | stable toolchain |
| cargo | `cargo --version` | version matches `rustc` |
| spacetime | `spacetime --version` | SpacetimeDB CLI present |
| blender | `blender --version` | If not on `PATH`, try `/Applications/Blender.app/Contents/MacOS/Blender --version` |
| claude | `claude --version` | Claude Code CLI |
| uv | `uv --version` | used for Blender MCP via `uvx` |

## MCP Servers

```bash
claude mcp list
```

Expected: all configured servers connect. Per [`14-mcp-setup.md`](14-mcp-setup.md):

- [ ] filesystem
- [ ] git
- [ ] github
- [ ] blender
- [ ] playwright
- [ ] memory
- [ ] sequential-thinking

> Note: the `blender` MCP only fully connects when Blender is open with the MCP add-on server running (see `14-mcp-setup.md`).

## Verify All (copy-paste)

```bash
uname -m
brew --prefix
git --version
gh --version
node --version
pnpm --version
rustc --version
cargo --version
spacetime --version
blender --version || /Applications/Blender.app/Contents/MacOS/Blender --version
claude --version
uv --version
gh auth status
claude mcp list
```

## Checklist

- [ ] Architecture is `arm64`
- [ ] git, gh, node, pnpm present
- [ ] rustc, cargo present
- [ ] spacetime present
- [ ] blender present (CLI or app path)
- [ ] claude, uv present
- [ ] gh authenticated (`gh auth status`)
- [ ] All MCP servers connect (`claude mcp list`)
