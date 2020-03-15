module.exports = async function (guild, song, client, seek, play) {
    const Discord = require('discord.js');
    const ytdl = require('ytdl-core');
    const streamConfig = require("../config/streamConfig.js");
    const getThumb = require('video-thumbnail-url');

    const queue = client.queue.get(guild.id);
    if (!song) {
        queue.voiceChannel.leave();
        client.queue.delete(guild.id);
        return;
    }
    const dispatcher = queue.connection
        .play(await ytdl(song.url, streamConfig.ytdlOptions), streamConfig.options).on("finish", () => {
            client.dispatcher.finish(client, queue.endReason, guild);
        }).on('start', () => {
            dispatcher.player.streamingData.pausedTime = 0;
        }).on('error', error => {
            client.dispatcher.error(client, error, guild);
        });
    dispatcher.setVolume(queue.volume / 10);
    if (client.global.db.guilds[guild.id].startPlaying || play) {
        const data = await Promise.resolve(ytdl.getInfo(queue.songs[0].url));
        const songtime = (data.length_seconds * 1000).toFixed(0);
        const thumbnail = getThumb(queue.songs[0].url);
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.messages.startPlaying}**${song.title}**`)
            .setDescription(`Song duration: \`${client.funcs.msToTime(songtime, "hh:mm:ss")}\``)
            .setThumbnail(thumbnail._rejectionHandler0)
            .setColor(client.config.embedColor)
        queue.textChannel.send(embed);
    }
    queue.playing = true;
}
