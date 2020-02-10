module.exports = {
    name: 'volume',
    async execute(msg, args, client, Discord, prefix) {
        if (!args[2]) return msg.channel.send(`:speaker: Current default volume is: \`${client.global.db.guilds[msg.guild.id].defaultVolume}\``);
        if (isNaN(args[2])) return msg.channel.send('<:redx:674263474704220182> I\'m sorry, But the default volume needs to be a valid __number__.');
        if (args[2].length > 2) return msg.channel.send('<:redx:674263474704220182> The default volume must be below `100` for quality and safety resons.');
        client.global.db.guilds[msg.guild.id].defaultVolume = args[2];
        msg.channel.send(`<:green_check_mark:674265384777416705> Default volume set to: \`${args[2]}\``);
    }
};