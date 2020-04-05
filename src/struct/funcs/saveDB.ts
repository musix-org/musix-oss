module.exports = async function (client) {
    if (client.config.saveDB && !client.config.devMode) {
        //console.log('DB saved');
        client.guilds.cache.forEach(guild => {
            client.db.collection('guilds').doc(guild.id).set({
                prefix: client.global.db.guilds[guild.id].prefix,
                defaultVolume: client.global.db.guilds[guild.id].defaultVolume,
                permissions: client.global.db.guilds[guild.id].permissions,
                dj: client.global.db.guilds[guild.id].dj,
                djrole: client.global.db.guilds[guild.id].djrole,
                startPlaying: client.global.db.guilds[guild.id].startPlaying,
                bass: client.global.db.guilds[guild.id].bass,
            });
        });
    }
}
