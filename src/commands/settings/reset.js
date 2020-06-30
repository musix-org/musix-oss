module.exports = {
    name: 'reset',
    async execute(msg, args, client) {
        client.global.db.guilds[guild.id] = {
            prefix: client.config.prefix,
            defaultVolume: client.config.defaultVolume,
            permissions: client.config.permissions,
            dj: client.config.dj,
            djrole: client.config.djrole,
            startPlaying: client.config.startPlaying,
            bass: client.config.bass,
            blacklist: [],
            premium: false,
            playSimilar: client.config.playSimilar,
        };
        msg.channel.send(client.messages.reset);
    }
};