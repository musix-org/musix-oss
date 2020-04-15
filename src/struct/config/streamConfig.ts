module.exports = {
  ytdlOptions: { filter: "audio", highWaterMark: 1 << 10, volume: false },
  options: {
    seek: 0,
    bitrate: 1024,
    volume: 1,
    type: "converted",
  },
};
