module.exports = async function (client, msg, youtube, voiceChannel, url) {
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const lmsg = await msg.channel.send(client.messages.loadingSongs);
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id);
            await client.funcs.handleVideo(video2.url, msg, voiceChannel, client, true);
        }
        let message;
        message = client.messages.playlistAdded.replace("%TITLE%", playlist.title);
        lmsg.edit(message);
        return true;
    } else {
        return false;
    }
};