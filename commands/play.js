const YouTube = require("simple-youtube-api");

module.exports = {
	name: 'play',
	alias: 'p',
	usage: '<song name>',
	description: 'Play some music.',
	onlyDev: false,
	permission: 'none',
	category: 'music',
	async execute(msg, args, client, Discord, prefix) {
		const youtube = new YouTube(client.config.api_key);
		const searchString = args.slice(1).join(" ");
		const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
		const serverQueue = client.queue.get(msg.guild.id);
		const voiceChannel = msg.member.voice.channel;
		if (!serverQueue) {
			if (!msg.member.voice.channel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in a voice channel to play music!');
		} else {
			if (voiceChannel !== serverQueue.voiceChannel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in the same voice channel as Musix to play music!');
		}
		if (!args[1]) return msg.channel.send('<:redx:674263474704220182> You need to use a link or search for a song!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('<:redx:674263474704220182> I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('<:redx:674263474704220182> I cannot speak in your voice channel, make sure I have the proper permissions!');
		}
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const lmsg = await msg.channel.send('<a:loading:674284196700618783> Loading song(s)');
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id)
					.catch(err => {
						console.error(err);
						return lmsg.edit(`<:redx:674263474704220182> Error loading songs!\nNot all songs we're loaded! This may have been caused by the playlist containing privated/deleted videos!`);
					});
				await client.funcs.handleVideo(video2, msg, voiceChannel, client, true);
			}
			return lmsg.edit(`<:green_check_mark:674265384777416705> Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					const videos = await youtube.searchVideos(searchString, 1);
					var video = await youtube.getVideoByID(videos[0].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('<:redx:674263474704220182> I could not obtain any search results!');
				}
			}
			return client.funcs.handleVideo(video, msg, voiceChannel, client, false);
		}
	}
};
