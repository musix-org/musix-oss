const DBL = require("dblapi.js");

module.exports = {
    name: 'ready',
    async execute(client, Discord) {
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
                };
            });
        }
        console.log('- DB Set -');
        client.user.setActivity(`@${client.user.username} help | 🎶`, { type: 'LISTENING' });
        client.user.setStatus('online');
        const dbl = new DBL(client.config.dblKey, client);
        if (client.config.dblApi && !client.config.devMode) {
            dbl.on('error', error => {
                console.log('Error with DBL: ' + error);
            })
            dbl.postStats(client.guilds.size);
        }
        console.log('- Activated -');
        setInterval(async () => {
            if (client.config.saveDB && !client.config.devMode) {
                console.log('DB saved');
                client.guilds.cache.forEach(guild => {
                    client.db.collection('guilds').doc(guild.id).set({
                        prefix: client.global.db.guilds[guild.id].prefix,
                        defaultVolume: client.global.db.guilds[guild.id].defaultVolume,
                        permissions: client.global.db.guilds[guild.id].permissions,
                        premium: client.global.db.guilds[guild.id].premium,
                        dj: client.global.db.guilds[guild.id].dj,
                        djrole: client.global.db.guilds[guild.id].djrole,
                        startPlaying: client.global.db.guilds[guild.id].startPlaying,
                    });
                });
            }
            if (client.config.dblApi && !client.config.devMode) dbl.postStats(client.guilds.size);
        }, 1800000);
        setInterval(() => {
            client.funcs.ffmpeg(client, Discord);
        }, 7200000);
    }
}
