module.exports = {
    name: 'ready',
    async execute(client, dbl) {
        const remoteMusixGuildsData = await client.funcs.dbget('guilds', null, client);
        remoteMusixGuildsData.forEach(guildData => {
            client.global.db.musix_guilds[guildData.id] = guildData.d;
        });
        console.log('- DB Set -');
        client.user.setActivity(`@musix help | 🎶`, { type: 'LISTENING' });
        client.user.setStatus('dnd');
        console.log('- Activated -');
        setInterval(async () => {
            client.guilds.forEach(guild => {
                client.db.collection('guilds').doc(guild.id).set(client.global.db.musix_guilds[guild.id]);
                dbl.postStats(client.guilds.size);
            });
        }, 1200000);
    }
}