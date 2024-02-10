const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'invite',
    alias: ["i"],
    usage: '',
    description: 'Invite Musix.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, command) {
        const embed = new EmbedBuilder()
            .setTitle(client.messages.inviteTitle)
            .setURL(client.config.invite)
            .setColor(client.config.embedColor)
        msg.channel.send(embed);
    }
};
