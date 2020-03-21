module.exports = {
    name: 'reset',
    async execute(msg, args, client) {
        client.global.db.guilds[msg.guild.id] = {
            prefix: client.config.prefix,
            defaultVolume: 5,
            permissions: false,
            premium: false,
            dj: false,
            djrole: null
        };
        msg.channel.send(client.messages.reset);
    }
};