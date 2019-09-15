module.exports = {
    name: 'guildmeberadd',
    async execute(client) {
        musix.user.setActivity(`music to ${client.users.size} users!`, { type: 'PLAYING' });
    }
}