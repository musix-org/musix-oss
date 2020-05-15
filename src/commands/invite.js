module.exports = {
    name: 'invite',
    alias: ["i"],
    usage: '',
    description: 'Invite Musix.',
    onlyDev: false,
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, command) {
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.inviteTitle)
            .setURL(client.config.invite)
            .setColor(client.config.embedColor)
        msg.channel.send(embed);
        msg.channel.send(client.messages.joinSupport + client.config.supportServer);
    }
};