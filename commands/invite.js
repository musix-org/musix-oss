module.exports = {
    name: 'invite',
    description: 'Invite command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed) {
        const embed = new RichEmbed()
            .setTitle('Invite Musix to your Discord server!')
            .setURL('https://bit.ly/2YDrKgh')
            .setColor('#b50002')
        return message.channel.send(embed);
    }
};