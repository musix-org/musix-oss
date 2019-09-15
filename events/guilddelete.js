module.exports = {
    name: 'guilddelete',
    async execute(client, guild) {
        musix.user.setActivity(`music to ${client.users.size} users!`, { type: 'PLAYING' });
    }
}