const YouTube = require("simple-youtube-api");
const search = require('yt-search');

module.exports = {
	name: 'play',
	alias: 'p',
	usage: '<song name>',
	description: 'Play some music.',
	onlyDev: false,
	permission: 'none',
	category: 'music',
	async execute(msg, args, client, Discord, command) {
		const youtube = new YouTube(client.config.api_key);
		const searchString = args.slice(1).join(" ");
		const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
		const queue = client.queue.get(msg.guild.id);
		const voiceChannel = msg.member.voice.channel;
		if (!queue) {
			if (!msg.member.voice.channel) return msg.channel.send(client.messages.noVoiceChannel);
		} else {
			if (voiceChannel !== queue.voiceChannel) return msg.channel.send(client.messages.wrongVoiceChannel);
		}
		if (!args[1]) return msg.channel.send(client.messages.noQuery);
		if (voiceChannel.full) return msg.channel.send(client.messages.channelFull);
		if (!voiceChannel.joinable) return msg.channel.send(client.messages.noPermsConnect);
		if (!voiceChannel.speakable) return msg.channel.send(client.messages.noPermsSpeak);
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const lmsg = await msg.channel.send(client.messages.loadingSongs);
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await client.funcs.handleVideo(video2, msg, voiceChannel, client, true);
			}
			client.messages.playlistAdded = client.messages.playlistAdded.replace("%TITLE%", playlist.title);
			return lmsg.edit(client.messages.playlistAdded);
		} else {
			search(searchString, function (err, res) {
				if (err) return console.log(err);
				if (res.videos.length === 0) return msg.channel.send(client.messages.noResults);
				client.funcs.handleVideo(res.videos[0], msg, voiceChannel, client, false);
			})
		}
	}
};
