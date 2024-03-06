const YouTube = require("simple-youtube-api");
const he = require('he');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'add',
    async execute(message, args, client, prefix) {
        if (client.global.db.playlists[message.guild.id].saved) {
            const serverQueue = client.queue.get(message.guild.id);
            const youtube = new YouTube(client.config.youtube_api_key);
            const searchString = args.slice(2).join(" ");
            const url = args[2] ? args[2].replace(/<(.+)>/g, "$1") : "";
            if (!args[2]) return message.channel.send(':x: You need to use a link or search for a song!');
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    const embed = new EmbedBuilder()
                        .setTitle("__Song Selection__")
                        .setDescription(`${videos.map(video2 => `**${++index}** ${he.decode(video2.title)} `).join('\n')}`)
                        .setFooter({ text: "Please provide a number ranging from 1-10 to select one of the search results." })
                        .setColor("#b50002")
                    message.channel.send({ embeds: [embed] });
                    try {
                        var response = await message.channel.awaitMessages({
                            filter: message2 => message2.content > 0 && message2.content < 11,
                            max: 1,
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
                title: he.decode(video.title),
                url: `https://www.youtube.com/watch?v=${video.id}`
            }
            client.global.db.playlists[message.guild.id].songs.push(song);
            message.channel.send(`:white_check_mark: ${song.title} added to the playlist!`);
        } else return message.channel.send(':x: There is no playlist saved! Start by using the save option!');
    }
};
