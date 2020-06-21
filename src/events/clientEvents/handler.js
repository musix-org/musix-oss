module.exports = function (client) {
    const Discord = require('discord.js');
    client.on('ready', () => {
        require(`./ready.js`).execute(client, Discord);
    }).on('message', (msg) => {
        require(`./msg.js`).execute(client, msg, Discord);
    }).on('guildCreate', (guild) => {
        require(`./guildCreate.js`).execute(client, guild);
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
        console.log(`Shard ${id} disconnected event ${event}`);
    }).on('shardError', (error, shardId) => {
        console.log(`Shard ${shardId} error ${error}`);
    }).on('shardReady', (id, unavailableGuilds) => {
        console.log(`Shard ${id} ready. Unavailable guilds: ${unavailableGuilds || 0}`);
    }).on('shardReconnecting', (id) => {
        console.log(`shard ${id} reconnecting.`);
    }).on('shardResume', (id, replayedEvents) => {
        console.log(`shard ${id} resume events ${replayedEvents}`);
    }).on("warn", (info) => {
        console.log(`Warn! info: ${info}`);
    });
}