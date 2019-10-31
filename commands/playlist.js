const YouTube = require("simple-youtube-api");
const he = require('he');

module.exports = {
    name: 'playlist',
    usage: '[option]',
    description: 'Save and load queues',
    alias: 'pl',
    cooldown: 10,
    async execute(message, args, client, Discord, prefix) {
        const embed = new Discord.RichEmbed()
            .setTitle('Options for playlist!')
            .addField('play', 'Play the guild specific queue.', true)
            .addField('save', 'Save the currently playing queue. Note that this will overwrite the currently saved queue!', true)
            .addField('add', 'Add songs to the playlist. Like song selection', true)
            .addField('remove', 'Remove songs from the playlist.', true)
            .addField('list', 'Display the playlist.', true)
            .setFooter(`how to use: ${prefix}playlist <Option> <Optional option>`)
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor('#b50002')
        const permissions = message.channel.permissionsFor(message.author);
        if (message.author.id !== client.global.devId) {
            if (client.global.db.guilds[message.guild.id].dj) {
                if (!message.member.roles.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to modify or play the playlist!');
            } else if (!permissions.has('MANAGE_GUILD')) return message.channel.send(':x: You need the `MANAGE_SERVER` permission to modify the playlist!');
        }
        if (client.global.db.guilds[message.guild.id].premium) {
            if (args[1]) {
                const optionName = args[1].toLowerCase();
                const option = client.playlistCmd.get(optionName) || client.playlistCmd.find(cmd => cmd.aliases && cmd.aliases.includes(optionName));
                if (!option) return message.channel.send(embed);
                try {
                    option.execute(message, args, client, Discord, prefix);
                } catch (error) {
                    message.reply(`:x: there was an error trying to execute that option! Please contact support with \`${prefix}bug\`!`);
                    const embed = new Discord.RichEmbed()
                        .setTitle(`Musix ${error.toString()}`)
                        .setDescription(error.stack.replace(/at /g, '**at **'))
                        .setColor('#b50002');
                    client.fetchUser(client.config.devId).then(user => user.send(embed)).catch(console.error);
                    client.channels.get('634718645188034560').send(embed);
                    console.log(error);
                }
            } else {
                return message.channel.send(embed);
            }
        } else return message.channel.send(":x: This is not a premium guild!");
    },
};
