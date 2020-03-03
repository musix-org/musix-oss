module.exports = {
    name: 'status',
    alias: 'stats',
    usage: '',
    description: 'See the current status for Musix.',
    onlyDev: false,
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, prefix) {
        const uptime = client.funcs.msToTime(client.uptime, "dd:hh:mm:ss");
        msg.channel.send('<a:loading:674284196700618783> Pinging...').then(m => {
            const latency = m.createdTimestamp - msg.createdTimestamp;

            const embed = new Discord.MessageEmbed()
                .setTitle(`Status for ${client.user.username}`)
                .addField(':signal_strength: Ping', client.ws.ping, true)
                .addField('Latency', latency, true)
                .addField(':stopwatch: Uptime', uptime, true)
                .addField(`:play_pause: Currently playing music on`, `${client.voice.connections.size} guild(s)`, true)
                .addField(`💿 Operating system`, process.platform, true)
                .setAuthor(client.user.username, client.user.displayAvatarURL)
                .setColor(client.config.embedColor)
            m.delete();
            return msg.channel.send(embed);
        });
    }
};
