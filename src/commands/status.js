module.exports = {
    name: 'status',
    alias: ["stats", "info"],
    usage: '',
    description: 'See the current status for Musix.',
    onlyDev: false,
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, command) {
        const uptime = client.funcs.msToTime(client.uptime, "dd:hh:mm:ss");
        msg.channel.send(client.messages.pinging).then(m => {
            const latency = m.createdTimestamp - msg.createdTimestamp;

            const embed = new Discord.MessageEmbed()
                .setTitle(client.messages.statusTitle)
                .addField(client.messages.statusField1, client.ws.ping, true)
                .addField(client.messages.statusField2, latency, true)
                .addField(client.messages.statusField3, uptime, true)
                .addField(client.messages.statusField4, client.shard.ids)
                .setAuthor(client.user.username, client.user.displayAvatarURL)
                .setColor(client.config.embedColor)
            m.delete();
            return msg.channel.send(embed);
        });
    }
};