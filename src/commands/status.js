const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'status',
    alias: ["stats", "info"],
    usage: '',
    description: 'See the current status for Musix.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, command) {
        const uptime = client.funcs.msToTime(client.uptime, "dd:hh:mm:ss");
        msg.channel.send(client.messages.pinging).then(m => {
            const latency = m.createdTimestamp - msg.createdTimestamp;

            const embed = new EmbedBuilder()
                .setTitle(client.messages.statusTitle)
                .addFields(
                    { name: client.messages.statusField1, value: client.ws.ping, inline: true },
                    { name: client.messages.statusField2, value: latency, inline: true },
                    { name: client.messages.statusField3, value: uptime, inline: true },
                    { name: client.messages.statusField4, value: client.shard.ids },
                )
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                .setColor(client.config.embedColor)
            m.delete();
            return msg.channel.send(embed);
        });
    }
};
