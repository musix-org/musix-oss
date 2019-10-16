module.exports = {
    name: 'ready',
    async execute(client, dbl) {
        const remoteMusixGuildsData = await client.funcs.dbget('guilds', null, client);
        const remoteMusixPlaylistsData = await client.funcs.dbget('playlists', null, client);
        remoteMusixGuildsData.forEach(guildData => {
            client.global.db.guilds[guildData.id] = guildData.d;
        });
        remoteMusixPlaylistsData.forEach(guildData => {
            client.global.db.playlists[guildData.id] = guildData.d;
        });
        console.log('- DB Set -');
        client.user.setActivity(`@musix help | 🎶`, { type: 'LISTENING' });
        client.user.setStatus('dnd');
        dbl.postStats(client.guilds.size);
        console.log('- Activated -');
        setInterval(async () => {
            client.guilds.forEach(guild => {
                client.db.collection('guilds').doc(guild.id).set({
                    prefix: client.global.db.guilds[guild.id].prefix,
                    defaultVolume: client.global.db.guilds[guild.id].defaultVolume,
                    permissions: client.global.db.guilds[guild.id].permissions,
                    premium: client.global.db.guilds[guild.id].premium,
                    dj: client.global.db.guilds[guild.id].dj,
                    djrole: client.global.db.guilds[guild.id].djrole,
                });
                if (client.global.db.guilds[guild.id].premium) {
                    client.db.collection('playlists').doc(guild.id).set({
                        songs: client.global.db.playlists[guild.id].songs,
                        saved: client.global.db.playlists[guild.id].saved,
                    });
                }
            });
            dbl.postStats(client.guilds.size);
        }, 1800000);
    }
}