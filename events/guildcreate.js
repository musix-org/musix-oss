module.exports = {
    name: 'guildcreate',
    async execute(client, guild) {
        let members = 0;
        client.guilds.forEach(x => members += x.memberCount); 'users: ' + client.users.size + ', guildMembers: ' + members;
        client.db.collection('guilds').doc(guild.id).set({
            musix_prefix: '>',
            defaultVolume: 5,
            permissions: true,
        });
        client.global.db.musix_guilds[guild.id] = {
            musix_prefix: ">",
            defaultVolume: 5,
            permissions: true,
        };
    }
}
