const { createAudioPlayer, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior } = require("@discordjs/voice");

module.exports = async function (video, message, voiceChannel, client, playlist = false) {
    let song = {
        id: video.id,
        title: he.decode(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        author: message.author
    }
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) {
        const construct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            audioPlayer: createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Play,
				}
			}),
            songs: [],
            volume: client.global.db.guilds[message.guild.id].defaultVolume,
            playing: false,
            paused: false,
            looping: false,
            votes: 0,
            voters: [],
            votesNeeded: null
        };
        construct.songs.push(song);
        client.queue.set(message.guild.id, construct);
        try {
            const connection =
				getVoiceConnection(voiceChannel.guild.id) ??
				joinVoiceChannel({
					channelId: voiceChannel.id,
					guildId: voiceChannel.guild.id,
					adapterCreator: voiceChannel.guild.voiceAdapterCreator
				});
            construct.connection = connection;
            client.funcs.play(message.guild, construct.songs[0], client, message, 0, true);
        } catch (error) {
            client.queue.delete(message.guild.id);
            console.log("Error with connecting to voice channel: " + error);
            return message.channel.send(`:x: An error occured: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return undefined;
        return message.channel.send(`:white_check_mark: **${song.title}** has been added to the queue!`);
    }
    return undefined;
}
