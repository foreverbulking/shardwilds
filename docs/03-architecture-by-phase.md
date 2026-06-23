# Architecture by Phase

## Global Architecture

```txt
Browser Client
  -> Game network abstraction
  -> SpacetimeDB client
  -> SpacetimeDB reducers and subscriptions
  -> Authoritative tables
```

The client renders and predicts. The server owns truth.

## Client Layers

```txt
React UI
React Three Fiber scene
Game state store
Game systems
Network adapter
Generated SpacetimeDB bindings
```

React components must not call SpacetimeDB directly everywhere. Use a network service boundary.

Recommended structure:

```txt
client/src/game/
  components/
  network/
  state/
  systems/
  ui/
  assets/
```

## Server Layers

```txt
server/src/
  lib.rs
  tables.rs
  reducers/
  systems/
  validation/
```

Every reducer must validate caller identity and game rules.

## Phase 1: Hearthvale Online

Tables:

```txt
Player
Character
Position
ChatMessage
Zone
```

Reducers:

```txt
create_character(name)
spawn_character()
update_movement(x, y, z, yaw, sequence)
send_chat_message(message)
logout()
```

Subscriptions:

```txt
characters in zone
positions in zone
recent chat messages in zone
```

Security:

- Character ownership check
- Movement speed check
- Zone boundary check
- Chat rate limit

## Phase 2: Gathering and Inventory

Tables:

```txt
ItemDefinition
InventoryItem
ResourceNode
GatheringActionLog
```

Reducers:

```txt
gather_resource(node_id)
```

Security:

- Distance validation
- Node availability check
- Respawn timer check
- Server-generated yield
- Inventory capacity check

## Phase 3: Farming and Crafting

Tables:

```txt
FarmPlot
Crop
Recipe
CraftingStation
CraftingActionLog
```

Reducers:

```txt
plant_crop(plot_id, seed_item_id)
water_crop(crop_id)
harvest_crop(crop_id)
craft_item(recipe_id, station_id)
```

Security:

- Plot ownership
- Growth timer validation
- Ingredient validation
- Station distance validation
- Server-created output

## Phase 4: Trade Pack Run

Tables:

```txt
TradePack
TradeRoute
TradeDeliveryLog
CurrencyLedger
```

Reducers:

```txt
create_trade_pack(recipe_id, station_id)
pickup_trade_pack(pack_id)
drop_trade_pack(pack_id)
deliver_trade_pack(pack_id, delivery_npc_id)
```

Security:

- Pack state validation
- Carrier validation
- Destination validation
- No teleport while carrying
- Movement slow enforced server-side
- Delivery reward logged

## Phase 5: Basic Action Combat

Tables:

```txt
Enemy
Health
AbilityCooldown
CombatEvent
DeathEvent
```

Reducers:

```txt
use_basic_attack(target_id, client_sequence)
use_ability(ability_id, target_id, aim_data)
```

Security:

- Cooldown validation
- Range validation
- Facing or aim validation
- Server-generated damage
- Server-owned health/death

## Phase 6: Copperroot Dungeon

Tables:

```txt
Instance
InstanceMember
DungeonState
DungeonEnemy
DungeonReward
```

Reducers:

```txt
create_dungeon_instance(dungeon_id)
enter_instance(instance_id)
leave_instance(instance_id)
complete_dungeon(instance_id)
claim_dungeon_reward(instance_id)
```

Security:

- Instance membership
- Reward claim once
- Instance isolation
- Expiration handling

## Phase 7: PvP Frontier

Tables:

```txt
PvpFlag
PvpDeathEvent
DroppedItem
DroppedTradePack
```

Reducers:

```txt
attack_player(target_character_id, ability_id)
claim_dropped_item(drop_id)
respawn_character()
```

Security:

- PvP zone check
- Friendly fire rules
- Death/drop rules
- Safe respawn protection

## Phase 8: Housing and Land

Tables:

```txt
HousingPlot
House
HouseStorage
Decoration
```

Reducers:

```txt
claim_plot(plot_id)
place_house(plot_id, house_type)
store_item(storage_id, item_id)
withdraw_item(storage_id, item_id)
place_decoration(house_id, decoration_id)
```

Security:

- Plot ownership
- Storage ownership
- Decoration ownership
- Item movement ledger
