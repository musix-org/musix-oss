const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'invite',
    description: 'Invite command.',
    alias: 'invite',
    cooldown: 5,
    execute(message, args, client, prefix) {
        const embed = new EmbedBuilder()
            .setTitle(`Invite ${client.user.username} to your Discord server!`)
            .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=2184465408&scope=applications.commands+bot`)
            .setColor(client.config.embedColor)
        return message.channel.send({ embeds: [embed] });
    }
};
