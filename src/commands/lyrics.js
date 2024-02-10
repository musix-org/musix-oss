const { EmbedBuilder } = require("discord.js");
const { getLyrics } = require("genius-lyrics-api");

module.exports = {
  name: "lyrics",
  alias: ["l"],
  usage: "<song>",
  description: "see the lyrics for a song",
  permission: "none",
  category: "util",
  async execute(msg, args, client, prefix, command) {
    const searchString = args.slice(1).join(" ");
    const options = {
      apiKey: client.config.genius_api_key,
      title: searchString,
      artist: "",
      optimizeQuery: true,
    };
    const queue = client.queue.get(msg.guild.id);
    if (queue && !args[1]) options.title = queue.songs[0].title;
    if (!queue && !args[1])
      return msg.channel.send(client.messages.lyricsUsage);
    getLyrics(options).then((lyrics) => {
      if (lyrics === null)
        return msg.channel.send(client.messages.noResultsLyrics);
      for (let i = 0; i < lyrics.length; i += 2000) {
        let toi = "";
        toi = lyrics.substring(i, Math.min(lyrics.length, i + 2000));
        const embed = new EmbedBuilder()
          .setTitle(client.messages.lyricsTitle)
          .setDescription(toi)
          .setColor(client.config.embedColor);
        msg.channel.send(embed);
      }
    });
  },
};
