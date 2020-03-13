module.exports = {
    name: 'restart',
    alias: 'none',
    usage: '',
    description: 'restart all shards',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, prefix, command) {
        client.shard.respawnAll(client.config.shardDelay, client.config.respawnDelay, client.config.spawnTimeout);
    }
};
