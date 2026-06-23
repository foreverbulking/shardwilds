---
name: blender-asset-brief-writer
description: Write Blender-ready asset briefs for Shardwilds stylized MMO props, characters, environments, and GLB exports.
---

# Blender Asset Brief Writer

Use this skill when creating asset specs for Blender, Blender MCP, artists, or placeholder GLB generation.

## Visual target
Shardwilds uses stylized anime fantasy:
- Dragon Quest-inspired charm
- Dragon Nest-inspired animation energy
- original designs only
- bright colors
- readable silhouettes
- low-to-mid poly browser-friendly assets
- toon/semi-toon materials

Do not copy protected characters, monsters, logos, music, names, UI, or exact designs from reference games.

## Asset brief format
```md
# Asset Brief: <Asset Name>

## Purpose
Where the asset appears and what gameplay it supports.

## Style
- Shape language:
- Color palette:
- Silhouette:
- Mood:

## Geometry
- Low/mid-poly target:
- Main forms:
- Avoid:

## Materials
- Material slots:
- Toon/flat/semi-toon notes:
- Emissive areas if any:

## Animation
- Required animations:
- Timing notes:
- Looping or one-shot:

## Gameplay readability
- How players identify it:
- Interaction indicators:
- Distance readability:

## Export
- Format: GLB
- Scale:
- Origin/pivot:
- Naming:
- File path:

## Acceptance checks
- [ ] Reads clearly from gameplay camera.
- [ ] Has correct origin and scale.
- [ ] Exports as GLB.
- [ ] Uses project naming convention.
```

## First asset categories
- player placeholder
- tree
- rock
- copper node
- fishing spot
- crafting table
- trade pack
- town house
- slime-like original creature
- dungeon door

## Rules
- Prioritize silhouette and animation over detail.
- Keep textures simple.
- Use final-art-neutral placeholder names.
- Specify GLB export requirements every time.
