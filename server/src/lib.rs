use spacetimedb::{Identity, ReducerContext, Table, Timestamp};

#[spacetimedb::table(accessor = player, public)]
pub struct Player {
    #[primary_key]
    identity: Identity,
    created_at: Timestamp,
    last_seen: Timestamp,
    online: bool,
}

#[spacetimedb::reducer(init)]
pub fn init(_ctx: &ReducerContext) {}

#[spacetimedb::reducer(client_connected)]
pub fn identity_connected(ctx: &ReducerContext) {
    let sender = ctx.sender();
    let now = ctx.timestamp;
    match ctx.db.player().identity().find(sender) {
        Some(existing) => {
            ctx.db.player().identity().update(Player {
                last_seen: now,
                online: true,
                ..existing
            });
        }
        None => {
            ctx.db.player().insert(Player {
                identity: sender,
                created_at: now,
                last_seen: now,
                online: true,
            });
        }
    }
}

#[spacetimedb::reducer(client_disconnected)]
pub fn identity_disconnected(ctx: &ReducerContext) {
    let sender = ctx.sender();
    if let Some(existing) = ctx.db.player().identity().find(sender) {
        ctx.db.player().identity().update(Player {
            last_seen: ctx.timestamp,
            online: false,
            ..existing
        });
    }
}

#[spacetimedb::reducer]
pub fn ping(ctx: &ReducerContext) {
    log::info!("ping from {}", ctx.sender());
}
