module.exports = {
    name: 'invite',
    description: 'Invite command.',
    alias: 'invite',
    cooldown: 5,
    onlyDev: false,
    execute(message, args, client, Discord, prefix) {
        const embed = new Discord.RichEmbed()
            .setTitle(`Invite ${client.user.username} to your Discord server!`)
            .setURL(client.config.invite)
            .setColor(client.config.embedColor)
        return message.channel.send(embed);
    }
};