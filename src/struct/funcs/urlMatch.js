module.exports = async function (client, msg, youtube, voiceChannel, url) {
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const lmsg = await msg.channel.send('<a:loading:674284196700618783> Loading song(s)');
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id);
            await client.funcs.handleVideo(video2, msg, voiceChannel, client, true);
        }
        lmsg.edit(`<:green_check_mark:674265384777416705> Playlist: **${playlist.title}** has been added to the queue!`);
        return true;
    } else {
        console.log('return false')
        return false;
    }
};