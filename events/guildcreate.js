module.exports = {
    name: 'guildcreate',
    async execute(client, guild) {
        if(client.config.firebase.serviceAccount){
            client.db.collection('guilds').doc(guild.id).set({
                prefix: client.config.prefix,
                defaultVolume: 50,
                permissions: false,
                premium: false,
                dj: false,
                djrole: null,
                startPlaying: true
            });
            client.global.db.guilds[guild.id] = {
                prefix: client.config.prefix,
                defaultVolume: 50,
                permissions: false,
                premium: false,
                dj: false,
                djrole: null,
                startPlaying: true
            };
        }
    }
}
