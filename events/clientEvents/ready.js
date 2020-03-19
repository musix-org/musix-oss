const DBL = require("dblapi.js");

module.exports = {
    name: 'ready',
    async execute(client, Discord) {
        const debugChannel = await client.channels.fetch(client.config.debug_channel);
        client.debug_channel = debugChannel
        const remoteMusixGuildsData = await client.funcs.dbget('guilds', null, client);
        remoteMusixGuildsData.forEach(guildData => {
            client.global.db.guilds[guildData.id] = guildData.d;
        });
        if (client.config.devMode) {
            console.log('dev mode');
            client.guilds.cache.forEach(guild => {
                client.global.db.guilds[guild.id] = {
                    prefix: client.config.prefix,
                    defaultVolume: client.config.defaultVolume,
                    permissions: client.config.permissions,
                    dj: client.config.dj,
                    djrole: client.config.djrole,
                    startPlaying: client.config.startPlaying,
                    bass: client.config.bass,
                };
            });
        }
        console.log(`- DB Set - Shard: ${client.shard.ids} -`);
        client.user.setActivity(`@${client.user.username} help | 🎶`, { type: 'LISTENING' });
        client.user.setStatus('online');
        const dbl = new DBL(client.config.dblKey, client);
        if (client.config.dblApi && !client.config.devMode) {
            dbl.on('posted', () => {
                console.log('Server count posted!');
            });
            dbl.on('error', error => {
                console.log('Error with DBL: ' + error);
            });
            dbl.postStats(client.guilds.size);
        }
        console.log(`- Activated - Shard: ${client.shard.ids} -`);
        setInterval(async () => {
            client.funcs.saveDB(client);
            if (client.config.dblApi && !client.config.devMode) dbl.postStats(client.guilds.cache.size);
        }, 1800000);
        setInterval(() => {
            client.funcs.ffmpeg(client, Discord);
        }, 7200000);
    }
}
