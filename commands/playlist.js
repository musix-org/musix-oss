const YouTube = require("simple-youtube-api");
const he = require('he');

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
                const permissions = voiceChannel.permissionsFor(message.client.user);
                if (!permissions.has('CONNECT')) {
                    return message.channel.send(':x: I cannot connect to your voice channel, make sure I have the proper permissions!');
                }
                if (!permissions.has('SPEAK')) {
                    return message.channel.send(':x: I cannot speak in your voice channel, make sure I have the proper permissions!');
                }
                let songs;
                if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
                if (args[2]) {
                    if (client.global.db.guilds[args[2]].premium && client.global.db.playlists[args[2]].saved) {
                        songs = client.global.db.playlists[args[2]].songs;
                    } else return message.channel.send(':x: There is no queue saved for this guild!')
                } else {
                    songs = client.global.db.playlists[message.guild.id].songs;
                }
                if (client.global.db.playlists[message.guild.id].saved) {
                    if (!serverQueue) {
                        const construct = {
                            textChannel: message.channel,
                            voiceChannel: message.member.voiceChannel,
                            connection: null,
                            songs: [...songs],
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
            } else if (args[1] === 'add') {
                const youtube = new YouTube(client.config.apikey);
                const searchString = args.slice(2).join(" ");
                const url = args[2] ? args[2].replace(/<(.+)>/g, "$1") : "";
                if (!args[2]) return message.channel.send(':x: You need to use a link or search for a song!');
                try {
                    var video = await youtube.getVideo(url);
                } catch (error) {
                    try {
                        var videos = await youtube.searchVideos(searchString, 10);
                        let index = 0;
                        const embed = new Discord.RichEmbed()
                            .setTitle("__Song Selection__")
                            .setDescription(`${videos.map(video2 => `**${++index}** ${he.decode(video2.title)} `).join('\n')}`)
                            .setFooter("Please provide a number ranging from 1-10 to select one of the search results.")
                            .setColor("#b50002")
                        message.channel.send(embed);
                        try {
                            var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                                maxMatches: 1,
                                time: 10000,
                                errors: ['time']
                            });
                        } catch (err) {
                            console.error(err);
                            return message.channel.send(':x: Cancelling video selection');
                        }
                        const videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    } catch (err) {
                        console.error(err);
                        return message.channel.send(':x: I could not obtain any search results!');
                    }
                }
                let song = {
                    id: video.id,
                    title: Discord.Util.escapeMarkdown(video.title),
                    url: `https://www.youtube.com/watch?v=${video.id}`
                }
                client.global.db.playlists[message.guild.id].songs.push(song);
                message.channel.send(`:white_check_mark: ${song.title} added to the playlist!`);
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle('Options for playlist!')
                    .addField('play', 'Play the guild specific queue.', true)
                    .addField('save', 'Save the currently playing queue.', true)
                    .addField('add', 'Add songs to the playlist. Like song selection', true)
                    .setFooter(`how to use: ${prefix}playlist <Option> <Optional option>`)
                    .setAuthor(client.user.username, client.user.displayAvatarURL)
                    .setColor('#b50002')
                return message.channel.send(embed);
            }
        } else return message.channel.send(":x: This is not a premium guild!");
    },
};
