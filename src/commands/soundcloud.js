module.exports = {
  name: "soundcloud",
  alias: ["none"],
  usage: "",
  description: "",
  onlyDev: true,
  permission: "dev",
  category: "play",
  async execute(msg, args, client, Discord, prefix, command) {
    if (!args[1]) return msg.channel.send(client.messages.noQuery);
    const SoundCloud = require("soundcloud-api-client");
    const key = client.config.soundCloud_api_key;
    const soundcloud = new SoundCloud({
      key
    });

    const q = "live mix";
    const genres = ["house", "tech-house", "techno"].join(",");

    soundcloud
      .get("/tracks", {
        q,
        genres
      })
      .then((tracks) => console.log(tracks))
      .catch((e) => console.error(e));
  },
};