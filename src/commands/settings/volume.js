module.exports = {
    name: 'volume',
    async execute(msg, args, client) {
        if (!args[2]) return msg.channel.send(`${client.messages.currentDefaultVolume} \`${client.global.db.guilds[msg.guild.id].defaultVolume}\``);
        if (isNaN(args[2])) return msg.channel.send(client.messages.defaultVolumeNumber);
        if (args[2].length > 2) return msg.channel.send(client.messages.defaultVolumeMax);
        client.global.db.guilds[msg.guild.id].defaultVolume = args[2];
        msg.channel.send(`${client.messages.defaultVolumeSet} \`${args[2]}\``);
    }
};