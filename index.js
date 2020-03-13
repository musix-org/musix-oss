const config = require("./struct/config/config.js");

if (config.devMode) {
    config.token = config.devToken;
    config.shards = 1;
}

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: config.token, respawn: true, totalShards: config.shards });

console.log('Launching shards...');
manager.spawn(config.shards, config.shardDelay, config.shardTimeout);
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));