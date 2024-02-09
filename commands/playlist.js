const YouTube = require("simple-youtube-api");
const he = require('he');
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'playlist',
    usage: '[option]',
    description: 'Save and load queues',
    alias: 'pl',
    cooldown: 10,
    async execute(message, args, client, prefix) {
        const embed = new EmbedBuilder()
            .setTitle('Options for playlist!')
            .addFields(
                { name: 'play', value: 'Play the guild specific queue.', inline: true },
                { name: 'save', value: 'Save the currently playing queue. Note that this will overwrite the currently saved queue!', inline: true },
                { name: 'add', value: 'Add songs to the playlist. Like song selection', inline: true },
                { name: 'remove', value: 'Remove songs from the playlist.', inline: true },
                { name: 'list', value: 'Display the playlist.', inline: true }
            )
            .setFooter({ text: `how to use: ${prefix}playlist <Option> <Optional option>` })
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL()})
            .setColor(client.config.embedColor)
        const permissions = message.channel.permissionsFor(message.author);
        if (client.global.db.guilds[message.guild.id].dj) {
            if (!message.member.roles.cache.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to modify or play the playlist!');
        } else if (!permissions.has(PermissionFlagsBits.ManageGuild)) return message.channel.send(':x: You need the `MANAGE_SERVER` permission to modify the playlist!');
        if (client.global.db.guilds[message.guild.id].premium) {
            if (args[1]) {
                const optionName = args[1].toLowerCase();
                const option = client.playlistCmd.get(optionName) || client.playlistCmd.find(cmd => cmd.aliases && cmd.aliases.includes(optionName));
                if (!option) return message.channel.send({ embeds: [embed] });
                try {
                    option.execute(message, args, client, prefix);
                } catch (error) {
                    message.reply(`:x: there was an error trying to execute that option!`);
                    console.log(error);
                }
            } else {
                return message.channel.send({ embeds: [embed] });
            }
        } else return message.channel.send(":x: This is not a premium guild!");
    },
};
