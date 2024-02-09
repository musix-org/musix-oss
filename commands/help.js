const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Help command.',
    alias: 'help',
    cooldown: 5,
    execute(message, args, client, prefix) {
        const embed = new EmbedBuilder()
            .setTitle(`Commands for ${client.user.username}!`)
            .addFields(
                { name: `${prefix}play | ${prefix}p`, value: 'Play a song.', inline: true },
                { name: `${prefix}skip | ${prefix}s`, value: 'Skip a song.', inline: true },
                { name: `${prefix}queue | ${prefix}q`, value: 'Display the queue.', inline: true },
                { name: `${prefix}nowplaying | ${prefix}np`, value: 'Display what\'s currently playing.', inline: true },
                { name: `${prefix}remove | ${prefix}rm`, value: 'Remove songs from the queue.', inline: true },
                { name: `${prefix}volume`, value: 'Change or check the volume.', inline: true },
                { name: `${prefix}pause`, value: 'Pause the music.', inline: true },
                { name: `${prefix}resume`, value: 'Resume the music.', inline: true },
                { name: `${prefix}loop`, value: 'Loop the queue.', inline: true },
                { name: `${prefix}seek`, value: 'Seek music.', inline: true },
                { name: `${prefix}stop`, value: 'Stop the music, Clear the queue and leave the current voice channel.', inline: true },
                { name: `${prefix}invite`, value: 'Invite Musix.', inline: true },
                { name: `${prefix}status`, value: 'See different information for Musix.', inline: true },
                { name: `${prefix}settings`, value: 'Change the guild specific settings.', inline: true },
                { name: `${prefix}help`, value: 'Display the help.', inline: true }
            )
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL()})
            .setColor(client.config.embedColor)
        return message.channel.send({ embeds: [embed] });
    }
};
