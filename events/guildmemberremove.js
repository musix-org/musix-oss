module.exports = {
    name: 'guildmeberremove',
    async execute(client) {
        musix.user.setActivity(`music to ${client.users.size} users!`, { type: 'PLAYING' });
    }
}