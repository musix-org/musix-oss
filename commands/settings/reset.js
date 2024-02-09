module.exports = {
    name: 'reset',
    async execute(message, args, client, prefix) {
        client.global.db.guilds[message.guild.id] = {
            prefix: client.config.prefix,
            defaultVolume: 5,
            permissions: false,
            premium: false,
            dj: false,
            djrole: null
        };
        message.channel.send(':white_check_mark: Reset __all__ guild settings!');
    }
};
