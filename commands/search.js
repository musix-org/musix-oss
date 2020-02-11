const YouTube = require("simple-youtube-api");
const he = require('he');

module.exports = {
    name: 'search',
    alias: 'sr',
    usage: 'search <search word(s)>',
    description: 'Search the top 10 queryes and choose one.',
    onlyDev: false,
    permission: 'none',
    category: 'music',
    async execute(msg, args, client, Discord, prefix) {
        const youtube = new YouTube(client.config.api_key);
        const searchString = args.slice(1).join(" ");
        const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
        const serverQueue = client.queue.get(msg.guild.id);
        const voiceChannel = msg.member.voice.channel;
        if (!serverQueue) {
            if (!msg.member.voice.channel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in a voice channel to play music!');
        } else {
            if (voiceChannel !== serverQueue.voiceChannel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in the same voice channel as Musix to play music!');
        }
        if (!args[1]) return msg.channel.send('<:redx:674263474704220182> You need to use a link or search for a song!');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('<:redx:674263474704220182> I cannot connect to your voice channel, make sure I have the proper permissions!');
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('<:redx:674263474704220182> I cannot speak in your voice channel, make sure I have the proper permissions!');
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const lmsg = await msg.channel.send('<a:loading:674284196700618783> Loading song(s)');
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await client.funcs.handleVideo(video2, msg, voiceChannel, client, true);
            }
            return lmsg.edit(`<:green_check_mark:674265384777416705> Playlist: **${playlist.title}** has been added to the queue!`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    const embed = new Discord.MessageEmbed()
                        .setTitle("__Song Selection__")
                        .setDescription(`${videos.map(video2 => `**${++index}** ${he.decode(video2.title)} `).join('\n')}`)
                        .setFooter("Please provide a number ranging from 1-10 to select one of the search results.")
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
                        return msg.channel.send('<:redx:674263474704220182> Cancelling video selection');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send('<:redx:674263474704220182> I could not obtain any search results!');
                }
            }
            return client.funcs.handleVideo(video, msg, voiceChannel, client, false);
        }
    }
};