const { EmbedBuilder } = require("discord.js");
const { getVoiceConnections } = require("@discordjs/voice");

module.exports = {
    name: 'status',
    description: 'Status command.',
    alias: 'status',
    cooldown: 5,
    async execute(message, args, client, prefix) {
        const uptime = client.funcs.msToTime(client.uptime);
        const ping = Math.floor(client.ws.ping * 10) / 10;

        const embed = new EmbedBuilder()
            .setTitle(`Status for ${client.user.username}`)
            .addFields(
                { name: ':signal_strength: Ping', value: ping + ' ms', inline: true },
                { name: ':stopwatch: Uptime', value: uptime, inline: true },
                { name: ':play_pause: Currently playing music on', value: `${getVoiceConnections.size ?? 0} guild(s)`, inline: true },
                { name: ':cd: Operating system', value: process.platform, inline: true }
            )
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL()})
            .setColor(client.config.embedColor)
        return message.channel.send({ embeds: [embed] });
    }
};
