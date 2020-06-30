const ytsr = require('ytsr');
const SpotifyApi = require("spotify-web-api-node");
const he = require('he');

module.exports = {
    name: 'search',
    alias: ["sr", "find"],
    usage: '<search word(s)>',
    description: 'Search the top 10 queryes and choose one.',
    onlyDev: false,
    permission: 'none',
    category: 'music',
    async execute(msg, args, client, Discord, command) {
        const spotify = new SpotifyApi({
            id: client.config.spotify_client_id,
            secret: client.config.spotify_client_secret,
        });
        spotify.setAccessToken(client.config.spotify_access_key);

        const searchString = args.slice(1).join(" ");
        const queue = client.queue.get(msg.guild.id);
        const voiceChannel = msg.member.voice.channel;
        if (!queue) {
            if (!msg.member.voice.channel) return msg.channel.send(client.messages.noVoiceChannel);
        } else {
            if (voiceChannel !== queue.voiceChannel) return msg.channel.send(client.messages.wrongVoiceChannel);
        }
        if (!args[1]) return msg.channel.send(client.messages.noQuery);
        if (voiceChannel.full) return msg.channel.send(client.messages.channelFull);
        if (!voiceChannel.joinable) return msg.channel.send(client.messages.noPermsConnect);
        if (!voiceChannel.speakable) return msg.channel.send(client.messages.noPermsSpeak);
        ytsr(searchString, {
            limit: 20,
        }, async function (err, res) {
            if (err) return console.log(err);
            if (!res.items[0]) return msg.channel.send(client.messages.noResults);
            const videoResults = res.items.filter(item => item.type === "video");
            const videos = videoResults.slice(0, 10);
            let index = 0;
            const embed = new Discord.MessageEmbed()
                .setTitle(client.messages.songSelection)
                .setDescription(`${videos.map(video2 => `**${++index}** ${he.decode(video2.title)} `).join('\n')}`)
                .setFooter(client.messages.provideANumber)
                .setColor(client.config.embedColor)
            msg.channel.send(embed);
            try {
                var response = await msg.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11 && message2.author === msg.author, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                });
            } catch (err) {
                console.error(err);
                return msg.channel.send(client.messages.cancellingVideoSelection);
            }
            const videoIndex = parseInt(response.first().content) - 1;
            spotify.searchTracks(`track:${videos[videoIndex].title}`)
                .then(function (data) {
                    client.funcs.handleVideo(
                        videoResults[0].link,
                        msg,
                        voiceChannel,
                        client,
                        false,
                        "ytdl",
                        data.body.tracks.items[0]
                    );
                }, function (err) {
                    console.log('Something went wrong!', err);
                });
            return client.funcs.handleVideo(videos[videoIndex].link, msg, voiceChannel, client, false, "ytdl");
        })
    }
};