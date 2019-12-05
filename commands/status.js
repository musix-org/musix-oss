module.exports = {
    name: 'status',
    description: 'Status command.',
    alias: 'status',
    cooldown: 5,
    onlyDev: false,
    execute(message, args, client, Discord, prefix) {
        let rawUptime = client.uptime;
        let uptime = {};
        uptime['d'] = rawUptime / 86400000;
        uptime['h'] = rawUptime / 3600000;
        uptime['m'] = rawUptime / 60000;
        let finalUptime;
        if (uptime.d < 1) {
            finalUptime = `${Math.round(uptime.h * 10) / 10} hours`;
        } else {
            finalUptime = `${Math.round(uptime.d * 10) / 10} days`;
        }
        let ping = Math.floor(client.ping * 10) / 10;

        const embed = new Discord.RichEmbed()
            .setTitle(`Status for ${client.user.username}`)
            .addField(':signal_strength: Ping', ping, true)
            .addField(':stopwatch: Uptime', finalUptime, true)
            .addField(`:play_pause: Currently playing music on`, `${client.voiceConnections.size} guild(s)`, true)
            .addField(`💿 Operating system`, process.platform, true)
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor(client.config.embedColor)
        return message.channel.send(embed);
    }
};
