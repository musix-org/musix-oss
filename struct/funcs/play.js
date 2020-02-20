module.exports = async function (guild, song, client, seek, play) {
    const Discord = require('discord.js');
    const ytdl = require('ytdl-core');
    const getThumb = require('video-thumbnail-url');
    const prism = require('prism-media');

    const serverQueue = client.queue.get(guild.id);
    if (!song) {
        console.log('No song')
        serverQueue.voiceChannel.leave();
        client.queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url), { filter: "audio", highWaterMark: 1 << 25, volume: false, seek: seek, bitrate: 1024, passes: 10, bassboost: client.global.db.guilds[guild.id].bass })
        .on("finish", reason => {
            client.dispatcher.finish(client, reason, guild);
        });
    dispatcher.on('start', () => {
        dispatcher.player.streamingData.pausedTime = 0;
    });
    dispatcher.on('error', error => {
        console.error(error);
        serverQueue.voiceChannel.leave();
        client.queue.delete(guild.id);
        return serverQueue.textChannel.send('<:redx:674263474704220182> An error has occured while playing music! The queue has been deleted.');
    });
    dispatcher.setVolume(serverQueue.volume / 10);
    if (client.global.db.guilds[guild.id].startPlaying || play) {
        const data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
        const songtime = (data.length_seconds * 1000).toFixed(0);
        const thumbnail = getThumb(serverQueue.songs[0].url);
        const embed = new Discord.MessageEmbed()
            .setTitle(`<a:aNotes:674602408105476106> Start playing: **${song.title}**`)
            .setDescription(`Song duration: \`${client.funcs.msToTime(songtime, "hh:mm:ss")}\``)
            .setThumbnail(thumbnail._rejectionHandler0)
            .setColor(client.config.embedColor)
        serverQueue.textChannel.send(embed);
    }
    serverQueue.playing = true;
}
