module.exports = function (client) {
    const Discord = require('discord.js');
    const events = './clientEvents/';
    client.on('ready', () => {
        require(`${events}ready`).execute(client, Discord);
    });
    client.on('message', (msg) => {
        require(`${events}msg`).execute(client, msg, Discord);
    });
    client.on('guildCreate', (guild) => {
        require(`${events}guildCreate`).execute(client, guild);
    });
    client.on('voiceStateUpdate', (oldState, newState) => {
        require(`${events}voiceStateUpdate`).execute(client, oldState, newState);
    });
    client.on('error', (error) => {
        client.channels.fetch(client.config.debug_channel).send(`Error: ${error} on shard: ${client.shard}`);
    });
}