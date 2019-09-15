module.exports = async function (video, message, voiceChannel, client, playlist = false) {
    const Discord = require('discord.js');
    let song = {
        id: video.id,
        title: Discord.Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    }
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue || restartmusic === true) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true
        };
        queueConstruct.songs.push(song);
        client.queue.set(message.guild.id, queueConstruct);
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            client.funcs.play(message.guild, queueConstruct.songs[0], client);
            if (restartmusic === true) {
                const serverQueue = client.queue.get(message.guild.id);
                song = client.config.songs[0];
                for (var i = 0; i < client.config.songs.length; i++) {
                    serverQueue.songs.push(client.config.songs[1]);
                    client.config.songs.shift();
                }
            }
        } catch (error) {
            client.queue.delete(message.guild.id);
            return message.channel.send(`:x: An error occured: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return undefined;
        return message.channel.send(`:white_check_mark: **${song.title}** has been added to the queue!`);
    }
    return undefined;
}