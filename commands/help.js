module.exports = {
    name: 'help',
    description: 'Help command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed) {
        const embed = new RichEmbed()
            .setTitle('Commands for Musix!')
            .addField('```-play | -p```', 'Play a song.', true)
            .addField('```-queue | -q```', 'Display the queue.', true)
            .addField('```-nowplaying | -np```', 'Display whats currently playing.', true)
            .addField('```-volume```', 'Change or check the volume.', true)
            .addField('```-pause```', 'Pause the music.', true)
            .addField('```-resume```', 'Resume the music.', true)
            .addField('```-stop```', 'Stop the music, Clear the queue and leave the current voice channel.', true)
            .addField('```-skip | -s```', 'Skip a song.', true)
            .addField('```-invite```', 'Invite Musix.', true)
            .addField('```-ping```', 'See the current ping for Musix', true)
            .addField('```-info```', 'Display the info', true)
            .addField('```-help```', 'Display the help.', true)
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor('#b50002')
        return message.channel.send(embed);
    }
};
