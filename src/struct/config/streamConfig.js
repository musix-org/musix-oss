module.exports = {
  ytdlOptions: {
    filter: "audio",
    highWaterMark: 1 << 25,
    volume: false,
  },
  options: {
    seek: null,
    bitrate: 1024,
    volume: 1,
    type: "converted",
  },
};