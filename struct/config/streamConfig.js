module.exports = {
    ytdlOptions: { filter: "audio", highWaterMark: 1 << 25, volume: false/*, begin: seek*/ },
    options: { seek: 0, bitrate: 1024, passes: 10, volume: 1/*, bassboost: queue.bass*/ }
};