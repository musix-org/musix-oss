module.exports = {
    name: 'ready',
    async execute(client) {
        const remoteMusixGuildsData = await client.funcs.dbget('guilds', null, client);
        remoteMusixGuildsData.forEach(guildData => {
            client.global.db.musix_guilds[guildData.id] = guildData.d;
        });
        await client.user.setActivity(`music to ${client.users.size} users!`, { type: 'PLAYING' });
        await client.user.setStatus('dnd');

        setInterval(async () => {
            client.guilds.forEach(guild => {
                client.db.collection('guilds').doc(guild.id).set(client.global.db.musix_guilds[guild.id]);
            });
            client.global.lastDBwrite = Date.now();
        }, 1200000);
    }
}