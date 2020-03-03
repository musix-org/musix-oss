module.exports = async function (video, msg, voiceChannel, client, playlist = false) {
    const Discord = require('discord.js');
    const song = {
        id: video.id,
        title: Discord.Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        author: msg.author
    }

    const serverQueue = client.queue.get(msg.guild.id);

    if (serverQueue) {
        serverQueue.songs.push(song);
        if (playlist) return;
        return msg.channel.send(`<:green_check_mark:674265384777416705> **${song.title}** has been added to the queue!`);
    }

    const construct = require("../config/queueConfig.js");
    construct.textChannel = msg.channel;
    construct.voiceChannel = voiceChannel;
    construct.volume = client.global.db.guilds[msg.guild.id].defaultVolume;
    construct.bass = client.global.db.guilds[msg.guild.id].bass;

    construct.songs.push(song);
    client.queue.set(msg.guild.id, construct);

    try {
        const connection = await voiceChannel.join();
        construct.connection = connection;
        client.funcs.play(msg.guild, construct.songs[0], client, 0, true);
    } catch (error) {
        client.queue.delete(msg.guild.id);
        client.debug_channel.send("Error with connecting to voice channel: " + error);
        return msg.channel.send(`<:redx:674263474704220182> An error occured: ${error}`);
    }
    return;
}
