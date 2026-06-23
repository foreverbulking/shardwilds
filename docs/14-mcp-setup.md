# MCP Setup

## Goal

Use MCP to give Claude controlled access to local tools while keeping permissions limited.

## Recommended MCP Servers

Start with:

- filesystem MCP
- git MCP
- GitHub MCP
- Blender MCP
- Playwright MCP
- memory MCP
- sequential-thinking MCP

## Permission Rules

Filesystem MCP should only access the project repo.

Allowed:

```txt
/path/to/shardwilds
```

Not allowed:

```txt
/Users/your-name
~/.ssh
~/.aws
~/.config
~/Library
Desktop
Downloads
```

## Blender MCP

Install `uv`:

```bash
brew install uv
```

Add Blender MCP to Claude Code:

```bash
claude mcp add blender -- uvx blender-mcp
claude mcp list
```

Blender also needs the Blender-side add-on installed and running.

Workflow:

1. Open Blender.
2. Enable the Blender MCP add-on.
3. Start the server from the Blender MCP panel.
4. Keep Blender open.
5. Ask Claude to inspect or modify the scene.

Test prompt:

```txt
Use Blender MCP to inspect the current scene and list all object names.
```

## MCP Safety

Treat MCP servers as tools with permissions.

Rules:

- Prefer official or widely used servers.
- Pin versions where possible.
- Do not expose secrets.
- Do not give production deploy access.
- Do not give cloud write access early.
- Review MCP server source before using unknown servers.
- Keep destructive actions approval-based.
