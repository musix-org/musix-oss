module.exports = {
    name: 'help',
    description: 'Help command.',
    alias: 'help',
    cooldown: 5,
    onlyDev: false,
    execute(message, args, client, Discord, prefix) {
        const embed = new Discord.RichEmbed()
            .setTitle(`Commands for ${client.user.username}!`)
            .addField(`${prefix}play | ${prefix}p`, 'Play a song.', true)
            .addField(`${prefix}skip | ${prefix}s`, 'Skip a song.', true)
            .addField(`${prefix}queue | ${prefix}q`, 'Display the queue.', true)
            .addField(`${prefix}nowplaying | ${prefix}np`, 'Display what\'s currently playing.', true)
            .addField(`${prefix}remove | ${prefix}rm`, 'Remove songs from the queue.', true)
            .addField(`${prefix}volume`, 'Change or check the volume.', true)
            .addField(`${prefix}pause`, 'Pause the music.', true)
            .addField(`${prefix}resume`, 'Resume the music.', true)
            .addField(`${prefix}loop`, 'Loop the queue.', true)
            .addField(`${prefix}stop`, 'Stop the music, Clear the queue and leave the current voice channel.', true)
            .addField(`${prefix}invite`, 'Invite Musix.', true)
            .addField(`${prefix}status`, 'See different information for Musix.', true)
            .addField(`${prefix}bug`, 'Report a bug.', true)
            .addField(`${prefix}settings`, 'Change the guild specific settings.', true)
            .addField(`${prefix}help`, 'Display the help.', true)
            .setAuthor(message.member.username, message.member.displayAvatarURL)
            .setColor(client.config.embedColor)
        return message.channel.send(embed);
    }
};
