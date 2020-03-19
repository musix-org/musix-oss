const YouTube = require("simple-youtube-api");

module.exports = {
	name: 'play',
	alias: 'p',
	usage: '<song name>',
	description: 'Play some music.',
	onlyDev: false,
	permission: 'none',
	category: 'music',
	async execute(msg, args, client, Discord, prefix, command) {
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
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					const videos = await youtube.searchVideos(searchString, 1);
					var video = await youtube.getVideoByID(videos[0].id);
				} catch (err) {
					console.error(err);
					if (err.code === 403) {
						if (client.config.api_key === client.config.api_key) {
							console.log('KEY 2');
							client.config.api_key = client.config.api_key2;
						} else if (client.config.api_key === client.config.api_key2) {
							console.log('KEY 3');
							client.config.api_key = client.config.api_key3;
						} else if (client.config.api_key === client.config.api_key3) {
							client.config.api_key = client.config.api_key4;
						}
						else if (client.config.api_key === client.config.api_key4) {
							client.config.api_key = client.config.api_key1;
						}
						return msg.channel.send(client.messages.quotaReached);
					}
					return msg.channel.send(client.messages.noResults);
				}
			}
			return client.funcs.handleVideo(video, msg, voiceChannel, client, false);
		}
	}
};
