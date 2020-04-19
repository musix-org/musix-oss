const config = require("./config/config.ts");

if (config.devMode) {
    console.log('- dev mode- ');
    config.token = config.devToken;
    config.shards = 1;
}

const {
    ShardingManager
} = require('discord.js');
const manager = new ShardingManager('./src/bot.ts', {
    token: config.token,
    respawn: config.respawn,
    totalShards: config.shards
});

console.log('- Launching shards -');
manager.spawn(config.shards, config.shardDelay, config.shardTimeout);
manager.on('shardCreate', shard => console.log(`- Launched shard ${shard.id} -`));