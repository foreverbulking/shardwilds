# Local Development Setup

## Environment

Target machine:

- macOS on Apple Silicon
- MacBook Air M4, 16GB RAM
- Terminal: zsh or bash
- Package manager: Homebrew

## Install Order

```bash
xcode-select --install
brew install git
brew install node
brew install pnpm
brew install rustup
brew install cmake
brew install pkg-config
brew install gh
brew install uv
brew install --cask visual-studio-code
brew install --cask blender
```

Initialize Rust:

```bash
rustup-init
```

Restart terminal after Rust setup.

## SpacetimeDB

Install SpacetimeDB CLI using the official install method.

Verify:

```bash
spacetime --version
```

Local server:

```bash
spacetime start
```

Local dev:

```bash
cd server
spacetime dev
```

## Client

```bash
cd client
pnpm install
pnpm dev
```

## GitHub CLI

```bash
gh auth login
```

## Blender

Install Blender with Homebrew cask or from the official website.

Use Blender for:

- Asset inspection
- GLB export
- Placeholder/blockout assets
- Material cleanup

## Performance Notes

On a 16GB MacBook Air:

Run comfortably:

- Claude Code
- One browser
- One Vite client
- Local SpacetimeDB
- VS Code

Avoid running all at once:

- Docker
- Blender
- Many browser tabs
- Multiple heavy agents
