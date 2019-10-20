const YouTube = require("simple-youtube-api");
const he = require('he');

module.exports = {
	name: 'play',
	description: 'Play command.',
	usage: '[song name]',
	args: true,
	cooldown: 3,
	async execute(message, args, client, Discord, prefix) {
		const youtube = new YouTube(client.config.apikey);
		const searchString = args.slice(1).join(" ");
		const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
		const serverQueue = client.queue.get(message.guild.id);
		const voiceChannel = message.member.voiceChannel;
return message.channel.send(':x: I\'m sorry but playing music is not available due to an error with FFMPEG!');
		if (!serverQueue) {
			if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
		} else {
			if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to play music!');
		}
		if (!args[1]) return message.channel.send(':x: You need to use a link or search for a song!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send(':x: I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send(':x: I cannot speak in your voice channel, make sure I have the proper permissions!');
		}
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await client.funcs.handleVideo(video2, message, voiceChannel, client, true);
			}
			return message.channel.send(`:white_check_mark: Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					const embed = new Discord.RichEmbed()
						.setTitle("__Song Selection__")
						.setDescription(`${videos.map(video2 => `**${++index}** ${he.decode(video2.title)} `).join('\n')}`)
						.setFooter("Please provide a number ranging from 1-10 to select one of the search results.")
						.setColor("#b50002")
					message.channel.send(embed);
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send(':x: Cancelling video selection');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send(':x: I could not obtain any search results!');
				}
			}
			return client.funcs.handleVideo(video, message, voiceChannel, client, false);
		}
	}
};
