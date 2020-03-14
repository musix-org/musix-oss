module.exports = {
    name: 'invite',
    alias: 'i',
    usage: '',
    description: 'Invite Musix.',
    onlyDev: false,
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, prefix, command) {
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.inviteTitle)
            .setURL(client.config.invite)
            .setColor(client.config.embedColor)
        return msg.channel.send(embed);
    }
};