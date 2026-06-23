# Asset Pipeline

## Asset Style

Shardwilds uses stylized low-to-mid poly fantasy assets.

Preferred formats:

- `.glb`
- `.gltf`

Avoid when possible:

- `.fbx` as final runtime format
- `.obj` without materials
- High-poly production assets

## Folder Structure

```txt
assets/
  source/
  raw/
  processed/
  licenses/
  thumbnails/
```

## Source Assets

Manual downloads go into:

```txt
assets/source/
```

Unpacked assets go into:

```txt
assets/raw/
```

Game-ready assets go into:

```txt
assets/processed/
```

## Licensing

Every source pack must be recorded in:

```txt
assets/licenses/ASSET_SOURCES.md
```

Preferred licenses:

- CC0
- Public domain
- MIT
- Apache-2.0

Avoid:

- Personal use only
- Editorial only
- Unclear license
- GPL assets
- CC-BY-SA unless explicitly approved

## Naming

Use project prefixes:

```txt
sw_tree_01.glb
sw_copper_node_01.glb
sw_trade_pack_01.glb
sw_house_hearthvale_01.glb
```

## Blender Rules

Use Blender for:

- Scale cleanup
- Material cleanup
- Object renaming
- GLB export
- Placeholder blockouts

Do not use Blender for:

- Final complex sculpting early
- Huge scenes
- High-poly rendering

## First Asset List

```txt
sw_player_placeholder.glb
sw_tree_01.glb
sw_rock_01.glb
sw_copper_node_01.glb
sw_fishing_spot_01.glb
sw_trade_pack_01.glb
sw_crafting_table_01.glb
sw_house_hearthvale_01.glb
sw_jelly_creature_01.glb
```
