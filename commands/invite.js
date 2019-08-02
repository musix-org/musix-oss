module.exports = {
    name: 'invite',
    description: 'Invite command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed) {
        return message.channel.send('Invite me with: https://bit.ly/2VGcuBR');
    }
};