module.exports = {
    name: 'guildcreate',
    async execute(client, guild) {
        client.db.collection('guilds').doc(guild.id).set({
            prefix: '>',
            defaultVolume: 5,
            permissions: false,
            premium: false,
            dj: false,
            djrole: null
        });
        client.global.db.guilds[guild.id] = {
            prefix: ">",
            defaultVolume: 5,
            permissions: false,
            premium: false,
            dj: false,
            djrole: null
        };
    }
}
