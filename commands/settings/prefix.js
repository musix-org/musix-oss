module.exports = {
    name: 'prefix',
    async execute(message, args, client, Discord, prefix) {
        if (!args[2]) return message.channel.send(`Current prefix: \`${client.global.db.guilds[message.guild.id].prefix}\``);
        client.global.db.guilds[message.guild.id].prefix = args[2];
        message.channel.send(`:white_check_mark: New prefix set to: \`${args[2]}\``);
    }
};