const { EmbedBuilder } = require("discord.js");
const { getVoiceConnections } = require("@discordjs/voice");

module.exports = {
    name: 'status',
    description: 'Status command.',
    alias: 'status',
    cooldown: 5,
    execute(message, args, client, prefix) {
        const uptime = client.funcs.msToTime(client.uptime);
        const ping = Math.floor(client.ws.ping * 10) / 10;

        const embed = new EmbedBuilder()
            .setTitle(`Status for ${client.user.username}`)
            .addFields(
                { name: ':signal_strength: Ping', value: ping, inline: true },
                { name: ':stopwatch: Uptime', value: uptime, inline: true },
                { name: ':play_pause: Currently playing music on', value: `${getVoiceConnections.size} guild(s)`, inline: true },
                { name: '💿 Operating system', value: process.platform, inline: true }
            )
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL()})
            .setColor(client.config.embedColor)
        return message.channel.send({ embeds: [embed] });
    }
};
