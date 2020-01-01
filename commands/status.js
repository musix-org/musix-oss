module.exports = {
    name: 'status',
    description: 'Status command.',
    alias: 'status',
    cooldown: 5,
    onlyDev: false,
    execute(message, args, client, Discord, prefix) {
        const uptime = client.funcs.msToTime(client.uptime);
        const ping = Math.floor(client.ping * 10) / 10;

        const embed = new Discord.RichEmbed()
            .setTitle(`Status for ${client.user.username}`)
            .addField(':signal_strength: Ping', ping, true)
            .addField(':stopwatch: Uptime', uptime, true)
            .addField(`:play_pause: Currently playing music on`, `${client.voiceConnections.size} guild(s)`, true)
            .addField(`💿 Operating system`, process.platform, true)
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor(client.config.embedColor)
        return message.channel.send(embed);
    }
};
