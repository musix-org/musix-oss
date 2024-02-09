const { EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = async function (guild, song, client, message, seek, play) {
    const serverQueue = client.queue.get(guild.id);
    if (!song) {
        serverQueue.connection.destroy();
        client.queue.delete(guild.id);
        return;
    }

    serverQueue.audioPlayer
		.on(AudioPlayerStatus.Idle, () => {
            serverQueue.playing = false;
			serverQueue.audioPlayer.removeAllListeners();
            if (serverQueue.looping) {
                serverQueue.songs.push(serverQueue.songs[0]);
            }
            serverQueue.songs.shift();
			client.funcs.play(guild, serverQueue.songs[0], client, message);
		})
		.on('error', (error) => {
			console.error(error)
		});

    const audioResource = createAudioResource(ytdl(song.url, { filter: "audio", highWaterMark: 1 << 25 }),{
        inlineVolume: true
    });

    audioResource.volume.setVolume(serverQueue.volume / 100);

    serverQueue.audioPlayer.play(audioResource);
    serverQueue.audioResource = audioResource;
    serverQueue.connection.subscribe(serverQueue.audioPlayer);

    /*.playStream(ytdl(song.url, { filter: "audio", highWaterMark: 1 << 25 }), { seek: seek, bitrate: 1024, passes: 10, volume: 1 })*/
    if (client.global.db.guilds[guild.id].startPlaying || play) {
        let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
        let songtime = (data.length_seconds * 1000).toFixed(0);
        const embed = new EmbedBuilder()
            .setTitle(`:musical_note: Start playing: **${song.title}**`)
            .setDescription(`Song duration: \`${client.funcs.msToTime(songtime)}\``)
            .setColor("#b50002")
        serverQueue.textChannel.send({ embeds: [embed] });
    }
    serverQueue.playing = true;
}
