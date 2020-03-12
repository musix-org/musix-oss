module.exports = {
    name: 'prefix',
    async execute(msg, args, client, Discord, prefix) {
        if (!args[2]) return msg.channel.send(`Current prefix: \`${client.global.db.guilds[msg.guild.id].prefix}\``);
        client.global.db.guilds[msg.guild.id].prefix = args[2];
        msg.channel.send(`${client.messages.prefixSet} \`${args[2]}\``);
    }
};