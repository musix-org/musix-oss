module.exports = function (client) {
    const Discord = require('discord.js');
    client.on('ready', () => {
            require(`./ready.js`).execute(client, Discord);
        }).on('message', (msg) => {
            require(`./msg.js`).execute(client, msg, Discord);
        }).on('guildCreate', (guild) => {
            require(`./guildCreate.js`).execute(client, guild);
        })
        .on('guildDelete', (guild) => {
            require(`./guildDelete.js`).execute(client, guild);
        }).on('voiceStateUpdate', (oldState, newState) => {
            require(`./voiceStateUpdate.js`).execute(client, oldState, newState);
        }).on('error', (error) => {
            console.log(error);
        }).on('debug', (info) => {
            if (client.config.devMode) console.log(info);
        }).on('invalidated', () => {
            console.log("Client session invalidated! Exiting the process!")
            process.exit(1);
        }).on('rateLimit', (rateLimitInfo) => {

        }).on('shardDisconnect', (event, id) => {
            client.logs.push(`Shard ${id} disconnected event ${event}`);
        }).on('shardError', (error, shardId) => {
            client.logs.push(`Shard ${shardId} error ${error}`);
        }).on('shardReady', (id, unavailableGuilds) => {
            client.logs.push(`Shard ${id} ready. Unavailable guilds: ${unavailableGuilds || 0}`);
        }).on('shardReconnecting', (id) => {
            client.logs.push(`shard ${id} reconnecting.`);
        }).on('shardResume', (id, replayedEvents) => {
            client.logs.push(`shard ${id} resume events ${replayedEvents}`);
        }).on("warn", (info) => {
            client.logs.push(`Warn! info: ${info}`);
            console.log(`Warn! info: ${info}`);
        });
}