module.exports = async function (guild, song, client, message, seek) {
    console.log("Play function")
    const Discord = require('discord.js');
    const ytdl = require('ytdl-core');
    const serverQueue = client.queue.get(guild.id);
    if (!song) {
        console.log("no song")
        serverQueue.voiceChannel.leave();
        client.queue.delete(guild.id);
        return;
    }
    console.log("playing stream")
    const dispatcher = serverQueue.connection
        .playStream(ytdl(song.url, { filter: "audio", highWaterMark: 1 << 25 }), { seek: seek, bitrate: 1024, passes: 10, volume: 1 })
        .on("end", reason => {
            if (reason === "Stream is not generating quickly enough.") {
                console.log("Song ended");
            } else if (reason === "seek") {
                return;
            } else {
                console.log(reason);
            }
            if (serverQueue.looping) {
                console.log("looping")
                serverQueue.songs.push(serverQueue.songs[0]);
            }
            console.log("shifting songs")
            serverQueue.songs.shift();
            console.log("playing next song")
            client.funcs.play(guild, serverQueue.songs[0], client, message);
        });
    console.log("setting volume")
    dispatcher.setVolume(serverQueue.volume / 10);
    console.log("checking for errors")
    dispatcher.on("error", error => console.error(error));
    console.log("defining data  |")
    //let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
    console.log("defining songtime |")
    //let songtime = (data.length_seconds * 1000).toFixed(0);
    console.log("creating embed")
    const embed = new Discord.RichEmbed()
        .setTitle(`:musical_note: Start playing: **${song.title}**`)
        //.setDescription(`Song duration: \`${client.funcs.msToTime(songtime)}\``)
        .setColor("#b50002")
    console.log("sending embed")
    return serverQueue.textChannel.send(embed);
}
