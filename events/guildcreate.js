module.exports = {
    name: 'guildcreate',
    async execute(client, guild) {
        musix.user.setActivity(`music to ${client.users.size} users!`, { type: 'PLAYING' });
        client.db.collection('musix_guilds').doc(guild.id).set({
            musix_prefix: '>',
        });
    }
}