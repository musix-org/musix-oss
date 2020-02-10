module.exports = {
    name: 'reset',
    async execute(msg, args, client, Discord, prefix) {
        client.global.db.guilds[msg.guild.id] = {
            prefix: client.config.prefix,
            defaultVolume: 5,
            permissions: false,
            premium: false,
            dj: false,
            djrole: null
        };
        msg.channel.send('<:green_check_mark:674265384777416705> Reset __all__ guild settings!');
    }
};