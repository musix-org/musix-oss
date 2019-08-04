module.exports = {
    name: 'invite',
    description: 'Invite command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed) {
        const embed = new RichEmbed()
            .setTitle('Commands for Musix!')
            .url('https://bit.ly/2YDrKgh')
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor('#b50002')
        return message.channel.send(embed);
    }
};