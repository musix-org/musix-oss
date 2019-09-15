module.exports = {
    name: 'help',
    description: 'Help command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed, prefix) {
        const embed = new RichEmbed()
            .setTitle('Commands for Musix!')
            .addField(`${prefix}play | ${prefix}p`, 'Play a song.', true)
            .addField(`${prefix}skip | ${prefix}s`, 'Skip a song.', true)
            .addField(`${prefix}queue | ${prefix}q`, 'Display the queue.', true)
            .addField(`${prefix}nowplaying | ${prefix}np`, 'Display whats currently playing.', true)
            .addField(`${prefix}volume`, 'Change or check the volume.', true)
            .addField(`${prefix}pause`, 'Pause the music.', true)
            .addField(`${prefix}resume`, 'Resume the music.', true)
            .addField(`${prefix}stop`, 'Stop the music, Clear the queue and leave the current voice channel.', true)
            .addField(`${prefix}restartmusic`, 'Restart the music. Recommended to use instead of stop on any possible errors.', true)
            .addField(`${prefix}invite`, 'Invite Musix.', true)
            .addField(`${prefix}status`, 'See different information for Musix.', true)
            .addField(`${prefix}bug`, 'Report a bug.', true)
            .addField(`${prefix}settings`, 'Change the guild specific settings.', true)
            .addField(`${prefix}help`, 'Display the help.', true)
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor('#b50002')
        return message.channel.send(embed);
    }
};
