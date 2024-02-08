module.exports = {
    name: 'volume',
    async execute(message, args, client, Discord, prefix) {
        if (!args[2]) return message.channel.send(`:speaker: Current default volume is: \`${client.global.db.guilds[message.guild.id].defaultVolume}\``);
        if (isNaN(args[2])) return message.channel.send(':x: I\'m sorry, But the default volume needs to be a valid __number__.');
        if (args[2].length > 2) return message.channel.send(':x: The default volume must be below `100` for quality and safety resons.');
        client.global.db.guilds[message.guild.id].defaultVolume = args[2];
        message.channel.send(`:white_check_mark: Default volume set to: \`${args[2]}\``);
    }
};