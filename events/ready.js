module.exports = {
    name: 'ready',
    async execute(client) {

        client.user.setActivity(`@${client.user.username} help | 🎶`, { type: 'LISTENING' });
        client.user.setStatus('online');
        console.log('- Activated -');

        client.guilds.cache.forEach(guild => {
            client.global.db.guilds[guild.id] = {
                prefix: client.config.prefix,
                defaultVolume: 50,
                permissions: false,
                premium: false,
                dj: false,
                djrole: null,
                startPlaying: true
            };
        });

        if(client.config.firebase.serviceAccount){
            const remoteMusixGuildsData = await client.funcs.dbget('guilds', null, client);
            const remoteMusixPlaylistsData = await client.funcs.dbget('playlists', null, client);
            remoteMusixGuildsData.forEach(guildData => {
                client.global.db.guilds[guildData.id] = guildData.d;
            });
            remoteMusixPlaylistsData.forEach(guildData => {
                client.global.db.playlists[guildData.id] = guildData.d;
            });
            console.log('- DB Set -');

            setInterval(async () => {
                client.guilds.cache.forEach(guild => {
                    client.db.collection('guilds').doc(guild.id).set({
                        prefix: client.global.db.guilds[guild.id].prefix,
                        defaultVolume: client.global.db.guilds[guild.id].defaultVolume,
                        permissions: client.global.db.guilds[guild.id].permissions,
                        premium: client.global.db.guilds[guild.id].premium,
                        dj: client.global.db.guilds[guild.id].dj,
                        djrole: client.global.db.guilds[guild.id].djrole,
                        startPlaying: client.global.db.guilds[guild.id].startPlaying
                    });
                    if (client.global.db.guilds[guild.id].premium) {
                        client.db.collection('playlists').doc(guild.id).set({
                            songs: client.global.db.playlists[guild.id].songs,
                            saved: client.global.db.playlists[guild.id].saved,
                        });
                    }
                });
            }, 1800000);
        }
    }
}
