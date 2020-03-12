module.exports = async function (client, msg, youtube, voiceChannel, url) {
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const lmsg = await msg.channel.send(client.messages.loadingSongs);
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id);
            await client.funcs.handleVideo(video2, msg, voiceChannel, client, true);
        }
        client.messages.playlistAdded = client.messages.playlistAdded.replace("%TITLE%", playlist.title);
        lmsg.edit(client.messages.playlistAdded);
        return true;
    } else {
        return false;
    }
};