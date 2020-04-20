module.exports = {
    name: 'prefix',
    async execute(msg, args, client) {
        if (!args[2]) return msg.channel.send(`${client.messages.currentPrefix} \`${client.global.db.guilds[msg.guild.id].prefix}\``);
        if (args[2].length > 5) return msg.channel.send(client.messages.prefixMaxLength);
        client.global.db.guilds[msg.guild.id].prefix = args[2];
        msg.channel.send(`${client.messages.prefixSet} \`${args[2]}\``);
    }
};