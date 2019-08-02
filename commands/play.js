const YouTube = require("simple-youtube-api");
const youtube = new YouTube(process.env.API_KEY);

module.exports = {
	name: 'play',
	description: 'Play command.',
	usage: '[song name]',
	args: true,
	cooldown: 3,
	async execute(message, args, client, RichEmbed) {
		const searchString = args.slice(1).join(" ");
		const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
		const serverQueue = client.queue.get(message.guild.id);
		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send(':x: I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send(':x: I cannot speak in this voice channel, make sure I have the proper permissions!');
		}
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await client.handleVideo(video2, message, voiceChannel, true);
			}
			return message.channel.send(`:white_check_mark: Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					const embed = new RichEmbed()
						.setTitle("__Song Selection__")
						.setDescription(`${videos.map(video2 => `**${++index}** \`${video2.title}\` `).join('\n')}`)
						.setFooter("Please provide a number ranging from __1-10__ to select one of the search results.")
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
						return Message.channel.send(':x: Cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send(':x: I could not obtain any search results.');
				}
			}
			return client.handleVideo(video, message, voiceChannel);
		}
	}
};