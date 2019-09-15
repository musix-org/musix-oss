module.exports = {
    name: 'status',
    description: 'Status command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed) {
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
        let onlinehost = process.env.hosted;
        let hosted = process.env.hosted;
        if (onlinehost !== undefined) {
            hosted = 'Online';
        } else {
            hosted = 'Locally';
        }
        let ping = Math.floor(client.ping * 10) / 10;

        const embed = new RichEmbed()
            .setTitle(`Status for ${client.user.username}`)
            .addField(':signal_strength: Ping', ping, true)
            .addField(':stopwatch: Uptime', finalUptime, true)
            .addField(`:play_pause: Currently playing music on ${client.voiceConnections.size} guilds.`, `Of ${client.guilds.size} Guilds.`, true)
            .addField(':satellite: Currently hosted', hosted, true)
            .addField(`💿 Operating system`, process.platform, true)
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor('#b50002')
        return message.channel.send(embed);
    }
};