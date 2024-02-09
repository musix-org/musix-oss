const { AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior } = require('@discordjs/voice');
const { Client, ActivityType, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')
const ytdl = require('ytdl-core');
const PREFIX = (process.env.BOT_PREFIX ?? "mx>");
const client = new Client({
	intents: [
		"Guilds",
		"GuildMessages",
		"GuildVoiceStates",
		"MessageContent"
	],
	disableMentions: 'everyone'
});
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);
const queue = new Map();
client.login(process.env.DISCORD_API_TOKEN);
client.on('ready', () => {
	client.user.setActivity(`${PREFIX}help`, { type: ActivityType.Listening })
	client.user.setStatus('online');
});
client.on('messageCreate', async msg => {
	if (!msg.guild || msg.author.bot) return;
	if (msg.content.startsWith(`${PREFIX}`)) {
		if (msg.content === `${PREFIX}ping`) {
			msg.channel.send(`My current Ping: **${Math.floor(client.ws.ping * 10) / 10} ms**.`);
			return;
		}
		if (msg.content === `${PREFIX}help`) {
			const embed = new Discord.EmbedBuilder()
				.setTitle('Commands for ' + client.user.username + '!')
				.addFields(
					{ name: '```' + `${PREFIX}` + 'play | ' + `${PREFIX}` + 'p```', value: 'Play a song.', inline: true },
					{ name: '```' + `${PREFIX}` + 'queue | ' + `${PREFIX}` + 'q```', value: 'Display the queue.', inline: true },
					{ name: '```' + `${PREFIX}` + 'nowplaying | ' + `${PREFIX}` + 'np```', value: 'Display whats currently playing.', inline: true },
					{ name: '```' + `${PREFIX}` + 'volume```', value: 'Change or check the volume.', inline: true },
					{ name: '```' + `${PREFIX}` + 'pause```', value: 'Pause the music.', inline: true },
					{ name: '```' + `${PREFIX}` + 'resume```', value: 'Resume the music.', inline: true },
					{ name: '```' + `${PREFIX}` + 'stop```', value: 'Stop the music, Clear the queue and leave the current voice channel.', inline: true },
					{ name: '```' + `${PREFIX}` + 'skip | ' + `${PREFIX}` + 's```', value: 'Skip a song.', inline: true },
					{ name: '```' + `${PREFIX}` + 'invite```', value: 'Invite ' + client.user.username + '.', inline: true },
					{ name: '```' + `${PREFIX}` + 'ping```', value: 'See the current ping for ' + client.user.username, inline: true },
					{ name: '```' + `${PREFIX}` + 'info```', value: 'Display info and instructions.', inline: true },
					{ name: '```' + `${PREFIX}` + 'help```', value: 'Display the help.', inline: true }
				)
				.setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
				.setColor('#b50002');
			msg.channel.send({ embeds: [embed] });
			return undefined;
		}
		if (msg.content === `${PREFIX}info`) {
			var line = '**>-----------------------------------------------------------------------<**';
			var dj = msg.guild.roles.cache.find(x => x.name === 'DJ') ? true : false;
			const embed = new Discord.EmbedBuilder()
				.setTitle('**' + client.user.username + ' instructions and info**:')
				.addFields(
					{ name: 'If your current guild has a role called \'DJ\' you will need it to use music commands! If your current guild doesn\'t have a role called \'DJ\' everyone can use music commands!', value:'DJ role existance: ' + dj, inline: true },
					{ name: 'If you encounter any errors with ' + client.user.username + ' please report about them on the offical ' + client.user.username + ' support server!', value: 'https://discord.gg/rvHuJtB', inline: true },
					{ name: `On errors you can do ${PREFIX}stop to reset the queue and try again!`, value: line, inline: true },
					{ name: 'Current Ping in milliseconds', value: `${Math.floor(client.ws.ping * 10) / 10} ms`, inline: true },
					{ name: 'Be careful with the Volume command! Volume is not recommended to be put over 3 with user volume at 100%!', value: 'Volume will reset to 1 always when a new song begins!', inline: true }
				)
				.setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
				.setColor('#b50002');
			msg.channel.send({ embeds: [embed] });
			return undefined;
		}
		if (msg.content === `${PREFIX}invite`) {
			msg.channel.send('Invite me with:' + '\n' + 'https://discord.com/oauth2/authorize?client_id=' + client.user.id + '&permissions=2184465408&scope=applications.commands+bot');
			return undefined;
		}
		if (msg.member.guild.roles.cache.find(x => x.name === 'DJ')) {
			if (msg.member.roles.cache.find(x => x.name === 'DJ')) {
				const args = msg.content.split(' ');
				const searchString = args.slice(1).join(' ');
				const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
				const serverQueue = queue.get(msg.guild.id);

				let command = msg.content.toLowerCase().split(' ')[0];
				command = command.slice(PREFIX.length);

				if (command === 'play' || command === 'p') {
					if (!args[1]) return msg.channel.send(':x: I\'m sorry but you didn\'t specify a song');
					const voiceChannel = msg.member.voice.channel;
					if (!voiceChannel) return msg.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
					const permissions = voiceChannel.permissionsFor(msg.client.user);
					if (!permissions.has(PermissionFlagsBits.Connect)) {
						return msg.channel.send(':x: I cannot connect to your voice channel, make sure I have the proper permissions!');
					}
					if (!permissions.has(PermissionFlagsBits.Speak)) {
						return msg.channel.send(':x: I cannot speak in this voice channel, make sure I have the proper permissions!');
					}
					if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
						const playlist = await youtube.getPlaylist(url);
						const videos = await playlist.getVideos();
						for (const video of Object.values(videos)) {
							const video2 = await youtube.getVideoByID(video.id);
							await handleVideo(video2, msg, voiceChannel, true);
						}
						return msg.channel.send(`:white_check_mark: Playlist: **${playlist.title}** has been added to the queue!`);
					} else {
						try {
							var video = await youtube.getVideo(url);
						} catch (error) {
							try {
								var videos = await youtube.searchVideos(searchString, 10);
								let index = 0;
								msg.channel.send(`
	__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
						`);

								try {
									var response = await msg.channel.awaitMessages({
										filter: msg2 => msg2.content > 0 && msg2.content < 11,
										max: 1,
										time: 10000,
										errors: ['time']
									});
								} catch (err) {
									return msg.channel.send(':x: Cancelling song selection.');
								}
								const videoIndex = parseInt(response.first().content);

								var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
							} catch (err) {
								return msg.channel.send(':x: I could not obtain any search results.');
							}
						}
						return handleVideo(video, msg, voiceChannel);
					}
				} else if (command === 'skip' || command === 's') {
					if (!msg.member.voice.channel) return msg.channel.send(':x: You are not in a voice channel!');
					if (!serverQueue) return msg.channel.send(':x: There is nothing playing that I could skip for you.');
					if (!serverQueue.songs[1]) return msg.channel.send(':x: Theres nothing to skip to!')
					serverQueue.audioPlayer.stop();
					return;
				} else if (command === 'stop') {
					if (!msg.member.voice.channel) return msg.channel.send(':x: You are not in a voice channel!');
					if (!serverQueue) return msg.channel.send(':x: There is nothing playing that I could stop for you.');
					serverQueue.songs = [];
					serverQueue.audioPlayer.stop();
					return;
				} else if (command === 'volume') {
					if (!msg.member.voice.channel) return msg.channel.send(':x: You are not in a voice channel!');
					if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
					if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}** :speaker:`);
					if (isNaN(args[1])) {
						return msg.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.')
					}
					serverQueue.volume = args[1];
					serverQueue.audioResource.volume.setVolume(args[1] / 100);
					return msg.channel.send(`I set the volume to: **${args[1]}** 🔊`);
				} else if (command === 'np' || command === 'nowplaying') {
					if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
					return msg.channel.send(`:musical_note: Now playing: **${serverQueue.songs[0].title}**`);
				} else if (command === "queue" || command === 'q') {
					if (!serverQueue)
						return msg.channel.send(":x: There is nothing in the queue.");
					var queuemessage = `__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}
**Now playing:** ${serverQueue.songs[0].title} :musical_note: `;
					if (queuemessage.length > 2000) {
						return msg.channel.send(":x: The queue has too many songs in it to show all in this channel. Try again after a few songs.");
					}
					return msg.channel.send(queuemessage);
				} else if (command === 'pause') {
					if (serverQueue && serverQueue.playing) {
						serverQueue.playing = false;
						serverQueue.audioPlayer.pause();
						return msg.channel.send(':pause_button: Paused the music for you!');
					}
					return msg.channel.send(':x: There is nothing playing.');
				} else if (command === 'resume') {
					if (serverQueue && !serverQueue.playing) {
						serverQueue.playing = true;
						serverQueue.audioPlayer.unpause();
						return msg.channel.send(':play_pause: Resumed the music for you!');
					}
					return msg.channel.send(':x: There is nothing playing.');
				}
				if (msg.content === `${PREFIX}`) return;
				msg.channel.send(`:x: Unknown command! Type ${PREFIX}help for the list of commands!`)
				return;
			}
			if (msg.content === `${PREFIX}`) return;
			var coms = [`${PREFIX}play`, `${PREFIX}queue`, `${PREFIX}np`, `${PREFIX}volume`, `${PREFIX}pause`, `${PREFIX}resume`, `${PREFIX}stop`, `${PREFIX}skip`, `${PREFIX}ping`, `${PREFIX}q`, `${PREFIX}nowplaying`, `${PREFIX}p`, `${PREFIX}s`];
			for (var i = 0; i < coms.length; i++) {
				if (msg.content.includes(coms[i])) {
					if (!msg.member.roles.cache.find(x => x.name === 'DJ')) {
						msg.channel.send(':x: i\'m sorry but you need to have the \'DJ\' role to use music commands!')
						return;
					}
				}
			}
			msg.channel.send(`:x: Unknown command! Type ${PREFIX}help for the list of commands!`)
			return;
		} else {
			const args = msg.content.split(' ');
			const searchString = args.slice(1).join(' ');
			const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
			const serverQueue = queue.get(msg.guild.id);

			let command = msg.content.toLowerCase().split(' ')[0];
			command = command.slice(PREFIX.length)

			if (command === 'play' || command === 'p') {
				if (!args[1]) return msg.channel.send(':x: I think you forgot what you wanted to play!');
				const voiceChannel = msg.member.voice.channel;
				if (!voiceChannel) return msg.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
				const permissions = voiceChannel.permissionsFor(msg.client.user);
				if (!permissions.has(PermissionFlagsBits.Connect)) {
					return msg.channel.send(':x: I cannot connect to your voice channel, make sure I have the proper permissions!');
				}
				if (!permissions.has(PermissionFlagsBits.Speak)) {
					return msg.channel.send(':x: I cannot speak in this voice channel, make sure I have the proper permissions!');
				}

				if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
					const playlist = await youtube.getPlaylist(url);
					const videos = await playlist.getVideos();
					for (const video of Object.values(videos)) {
						const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
						await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
					}
					return msg.channel.send(`:white_check_mark: Playlist: **${playlist.title}** has been added to the queue!`);
				} else {
					try {
						var video = await youtube.getVideo(url);
					} catch (error) {
						try {
							var videos = await youtube.searchVideos(searchString, 10);
							let index = 0;
							msg.channel.send(`
	__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
						`);
							// eslint-disable-next-line max-depth
							try {
								var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
									maxMatches: 1,
									time: 10000,
									errors: ['time']
								});
							} catch (err) {
								return msg.channel.send(':x: No or invalid value entered, cancelling video selection.');
							}
							const videoIndex = parseInt(response.first().content);
							var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
						} catch (err) {
							console.error(err);
							return msg.channel.send(':x: I could not obtain any search results.');
						}
					}
					return handleVideo(video, msg, voiceChannel);
				}
			} else if (command === 'skip' || command === 's') {
				if (!msg.member.voice.channel) return msg.channel.send(':x: You are not in a voice channel!');
				if (!serverQueue) return msg.channel.send(':x: There is nothing playing that I could skip for you.');
				msg.channel.send('Skipped :thumbsup:')
				serverQueue.audioPlayer.stop();
				return undefined;
			} else if (command === 'stop') {
				if (!msg.member.voice.channel) return msg.channel.send(':x: You are not in a voice channel!');
				if (!serverQueue) return msg.channel.send(':x: There is nothing playing that I could stop for you.');
				msg.channel.send('Stopped the music! :stop_button:')
				serverQueue.songs = [];
				serverQueue.audioPlayer.stop();
				return undefined;
			} else if (command === 'volume') {
				if (!msg.member.voice.channel) return msg.channel.send(':x: You are not in a voice channel!');
				if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
				if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}** :speaker:`);
				if (isNaN(args[1])) {
					return msg.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.')
				}
				serverQueue.volume = args[1];
				serverQueue.audioResource.volume.setVolume(args[1] / 100);
				return msg.channel.send(`I set the volume to: **${args[1]}** 🔊`);
			} else if (command === 'np' || command === 'nowplaying') {
				if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
				return msg.channel.send(`:musical_note: Now playing: **${serverQueue.songs[0].title}**`);
			} else if (command === "queue" || command === 'q') {
				if (!serverQueue)
					return msg.channel.send(":x: There is nothing in the queue.");
				var queuemessage = `__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}
**Now playing:** ${serverQueue.songs[0].title} :musical_note: `;
				if (queuemessage.length < 2000) {
					return msg.channel.send(":x: The queue has too many songs in it to show all in this channel. Try again after a few songs");
				}
				return msg.channel.send(queuemessage);
			} else if (command === 'pause') {
				if (serverQueue && serverQueue.playing) {
					serverQueue.playing = false;
					serverQueue.audioPlayer.pause();
					return msg.channel.send(':pause_button: Paused the music for you!');
				}
				return msg.channel.send(':x: There is nothing playing.');
			} else if (command === 'resume') {
				if (serverQueue && !serverQueue.playing) {
					serverQueue.playing = true;
					serverQueue.audioPlayer.unpause();
					return msg.channel.send(':play_pause: Resumed the music for you!');
				}
				return msg.channel.send(':x: There is nothing playing.');
			}
		}
		if (msg.content === `${PREFIX}`) {
			return;
		}
		msg.channel.send(`:x: Unknown command! Type ${PREFIX}help for the list of commands!`)
		return;
	}
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			audioPlayer: createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Play,
				}
			}),
			audioResource: null,
			songs: [],
			volume: 50,
			playing: true
		};

		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			const connection =
				getVoiceConnection(voiceChannel.guild.id) ??
				joinVoiceChannel({
					channelId: voiceChannel.id,
					guildId: voiceChannel.guild.id,
					adapterCreator: voiceChannel.guild.voiceAdapterCreator
				});
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`:x: I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(`:white_check_mark: **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.connection.destroy();
		queue.delete(guild.id);
		return;
	}

	serverQueue.audioPlayer
		.on(AudioPlayerStatus.Idle, () => {
			serverQueue.songs.shift();
			serverQueue.audioPlayer.removeAllListeners();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', (error) => {
			console.error(error)
		});

	const audioResource = createAudioResource(ytdl(song.url, { quality: `highestaudio`, filter: 'audioonly' }),{
		inlineVolume: true
	});

	audioResource.volume.setVolume(serverQueue.volume / 100);

	serverQueue.audioPlayer.play(audioResource);
	serverQueue.audioResource = audioResource;
	serverQueue.connection.subscribe(serverQueue.audioPlayer);

	serverQueue.textChannel.send(`:musical_note: Start playing: **${song.title}**`);
}
