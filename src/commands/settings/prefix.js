module.exports = {
    name: 'prefix',
    async execute(msg, args, client, Discord, prefix) {
        if (!args[2]) return msg.channel.send(`Current prefix: \`${client.global.db.guilds[msg.guild.id].prefix}\``);
        client.global.db.guilds[msg.guild.id].prefix = args[2];
        msg.channel.send(`<:green_check_mark:674265384777416705> New prefix set to: \`${args[2]}\``);
    }
};