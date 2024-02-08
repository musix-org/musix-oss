module.exports = {
    name: 'restart',
    alias: ["none"],
    usage: '',
    description: 'restart all shards',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, command) {
        client.shard.broadcastEval("this.funcs.saveDB(this);");
        msg.channel.send(client.messages.dbSaved);
        msg.channel.send(client.messages.restart);
        client.shard.respawnAll(client.config.shardDelay, client.config.respawnDelay, client.config.spawnTimeout);
    }
};