module.exports = {
    name: 'info',
    description: 'Info command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed) {
        const embed = new RichEmbed()
            .setTitle('**Musix instructions and info**:')
            .addField('If you encounter any errors with musix please report about them on the offical musix support server!', 'https://discord.gg/rvHuJtB', true)
            .addField('On errors you can do -stop to reset the queue and try again!', 'To use all commands make sure you have `MANAGE_MESSAGES` and `MANAGE_CHANNELS` permissions!')
            .addField('Current Ping', `${Math.floor(client.ping * 10) / 10} ms`, true)
            .addField('Be careful with the Volume command! Volume is not recommended to be put over 3 with user volume at 100%!', 'Volume will reset to 1 always when a new song begins!', true)
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor('#b50002')
        return message.channel.send(embed);
    }
};