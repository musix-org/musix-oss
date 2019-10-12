module.exports = {
    name: 'playlist',
    usage: '[option]',
    description: 'Save and load queues',
    cooldown: 10,
    async execute(message, args, client, Discord, prefix) {
        const serverQueue = client.queue.get(message.guild.id);
        if (client.global.db.guilds[message.guild.id].premium) {
            if (args[1] === 'play') {
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
                    .addField('save', 'Save the currently playing queue.')
                    .setFooter(`how to use: ${prefix}playlist <Option>`)
                    .setAuthor(client.user.username, client.user.displayAvatarURL)
                    .setColor('#b50002')
                return message.channel.send(embed);
            }
        } else return message.channel.send(":x: This is not a premium guild!");
    },
};
