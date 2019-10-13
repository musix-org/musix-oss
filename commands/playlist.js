module.exports = {
    name: 'playlist',
    usage: '[option]',
    description: 'Save and load queues',
    cooldown: 10,
    async execute(message, args, client, Discord, prefix) {
        const permissions = message.channel.permissionsFor(message.author);
        const serverQueue = client.queue.get(message.guild.id);
        if (message.author.id !== '360363051792203779') {
            if (client.global.db.guilds[message.guild.id].dj) {
                if (!message.member.roles.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to modify or play the playlist!');
            } else if (!permissions.has('MANAGE_GUILD')) return message.channel.send(':x: You need the `MANAGE_SERVER` permission to modify the playlist!');
        }
        if (client.global.db.guilds[message.guild.id].premium) {
            if (args[1] === 'play') {
                const voiceChannel = message.member.voiceChannel;
                if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
                if (client.global.db.playlists[message.guild.id].saved) {
                    if (!serverQueue) {
                        const construct = {
                            textChannel: message.channel,
                            voiceChannel: message.member.voiceChannel,
                            connection: null,
                            songs: [...client.global.db.playlists[message.guild.id].songs],
                            volume: client.global.db.guilds[message.guild.id].defaultVolume,
                            playing: true,
                            looping: false
                        };
                        client.queue.set(message.guild.id, construct);
                        message.channel.send(":white_check_mark: Queue set!");
                        try {
                            var connection = await message.member.voiceChannel.join();
                            construct.connection = connection;
                            client.funcs.play(message.guild, construct.songs[0], client, message, 0);
                        } catch (error) {
                            client.queue.delete(message.guild.id);
                            return message.channel.send(`:x: An error occured: ${error}`);
                        }
                    } else {
                        serverQueue.connection.dispatcher.end("queue set");
                        serverQueue.songs = [...client.global.db.playlists[message.guild.id].songs];
                        message.channel.send(":white_check_mark: Queue set!");
                    }
                } else return message.channel.send(':x: There is no queue set for this server!')
            } else if (args[1] === 'save') {
                if (!serverQueue) return message.channel.send(':x: There is nothing playing!');
                client.global.db.playlists[message.guild.id] = {
                    songs: serverQueue.songs,
                    firstSong: serverQueue.songs[0],
                    saved: true,
                };
                message.channel.send(":white_check_mark: Queue saved!");
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle('Options for playlist!')
                    .addField('play', 'Play the guild specific queue.', true)
                    .addField('save', 'Save the currently playing queue.', true)
                    .setFooter(`how to use: ${prefix}playlist <Option>`)
                    .setAuthor(client.user.username, client.user.displayAvatarURL)
                    .setColor('#b50002')
                return message.channel.send(embed);
            }
        } else return message.channel.send(":x: This is not a premium guild!");
    },
};
