const { Client, Util } = require('discord.js');
const Discord = require('discord.js');
const YouTube = require('simple-youtube-api')
const ytdl = require('ytdl-core');
const GOOGLE_API_KEY = (process.env.API_KEY)
const PREFIX = ('-')

const client = new Client({ disableEveryone: true });

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('disconnect', () => console.log('- Disconnected -'));

client.on('reconnecting', () => console.log('- Reconnecting -'));

client.on('ready', () => { //startup stuff
  console.log('- Connected -');
  client.user.setActivity('-help', { type: 'LISTENING' })
  client.user.setStatus('dnd');
});

client.on('message', async msg => {
	if (!msg.guild || msg.author.bot) return undefined;
	if (msg.content.toUpperCase().startsWith(`MUSIX`)) {
		msg.channel.send('-help to see my commands.')
	}
	if (msg.content.startsWith(`${PREFIX}`)) {
		if (msg.content === '-test') {
			if (msg.author.username === 'Matte') {
			msg.channel.send('Bot is currently online hosted!')
			}
			return undefined;
			}
			if (msg.content === '-restart') {
				if (msg.author.username !== 'Matte') {
					msg.channel.send(':x: I\'m sorry, But you can\'t do that!')
				}
				if (msg.author.username === 'Matte') {
					console.log('restarting...')
					msg.channel.send('Restarting...')
				}
				return undefined;
			}
			if (msg.content === 'Restarting...') {
				if (msg.author.username === 'Musix') {
					d.d('d')
				}
			}
			if (msg.content === `${PREFIX}ping`) {
				msg.channel.send(`My current ping is ${client.ping}`)
				return;
			  }
		if (msg.content === `${PREFIX}help`) {
		const embed = new Discord.RichEmbed()
		  .setTitle('Commands for Musix!')
		  .addField('```-play```', 'Play a song.', true)
		  .addField('```-queue```', 'Display the queue.', true)
		  .addField('```-np```', 'Display whats currently playing.', true)
		  .addField('```-volume```', 'Change or check the volume.', true)
		  .addField('```-pause```', 'Pause the music.', true)
		  .addField('```-resume```', 'Resume the music.', true)
		  .addField('```-stop```', 'Stop the music, Clear the queue and leave the current voice channel.', true)
		  .addField('```-skip```', 'Skip a song.', true)
		  .addField('```-invite```', 'Invite Musix.', true)
		  .addField('```-info```', 'Display info and instructions.', true)
		  .addField('```-help```', 'Display the help.', true)
		  .setAuthor('Musix', 'https://cdn.discordapp.com/avatars/572405135658188800/04c6f22b7600ddecfbc245dd3ec10f9f.png?size=2048')
		  .setColor('#b50002')
		  msg.channel.send(embed);
		  return undefined;
		}
		if (msg.content === `${PREFIX}info`) {
			var line = '**>-----------------------------------------------------------------------<**';
			var dj = msg.guild.roles.find(x => x.name === 'DJ') ? true : false;
			const embed = new Discord.RichEmbed()
	 		  .setTitle('**Musix instructions and info**:')
			  .addField('If your current guild has a role called \'DJ\' you will need it to use music commands! If your current guild doesn\'t have a role called \'DJ\' everyone can use music commands!', 'DJ role existance: ' + dj, true)
			  .addField('If you encounter any errors with musix please report about them on the offical musix support server!', 'https://discord.gg/rvHuJtB', true)
			  .addField('On errors you can do -stop to reset the queue and try again!', line, true)
			  .setAuthor('Musix', 'https://cdn.discordapp.com/avatars/572405135658188800/04c6f22b7600ddecfbc245dd3ec10f9f.png?size=2048')
			  .setColor('#b50002')
			  msg.channel.send(embed);
			  return undefined;
			}
		if(msg.content === `${PREFIX}invite`) {
		msg.channel.send('Invite me with: https://bit.ly/2V3D0p7') 
		return undefined;
		}
	if (msg.member.guild.roles.find(x => x.name === 'DJ')) {
	if (msg.member.roles.find(x => x.name === 'DJ')) {
		const args = msg.content.split(' ');
		const searchString = args.slice(1).join(' ');
		const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
		const serverQueue = queue.get(msg.guild.id);
	
		let command = msg.content.toLowerCase().split(' ')[0];
		command = command.slice(PREFIX.length)
	
		if (command === 'play') {
			if (!args[1]) return msg.channel.send(':x: I\'m sorry but you didn\'t specify a song');
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel) return msg.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) {
				return msg.channel.send(':x: I cannot connect to your voice channel, make sure I have the proper permissions!');
			}
			if (!permissions.has('SPEAK')) {
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
Please provide a value to select one of the search results ranging from __1-10__.
						`);
						// eslint-disable-next-line max-depth
						console.log('trying response')
						try {
							var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
								maxMatches: 1,
								time: 10000,
								errors: ['time']
							});
						} catch (err) {
							console.log('Error 1')
							console.error(err);
							return msg.channel.send(':x: No or invalid value entered, cancelling video selection.');
						}
						console.log('Start playing')
						const videoIndex = parseInt(response.first().content);
						var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
					} catch (err) {
						console.log('Error 2')
						console.error(err);
						return msg.channel.send(':x: I could not obtain any search results.');
					}
				}
				console.log('Play command done')
				return handleVideo(video, msg, voiceChannel);
			}
		} else if (command === 'skip') {
			if (!msg.member.voiceChannel) return msg.channel.send(':x: You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing that I could skip for you.');
			serverQueue.connection.dispatcher.end('Skipped');
			return undefined;
		} else if (command === 'stop') {
			if (!msg.member.voiceChannel) return msg.channel.send(':x: You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing that I could stop for you.');
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end('Stopped!');
			return undefined;
		} else if (command === 'volume') {
			if (!msg.member.voiceChannel) return msg.channel.send(':x: You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
			if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}** :speaker:`);
			if (isNaN(args[1])) {
				console.log('NAN')
				return msg.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.')
			}
			serverQueue.volume = args[1];
			serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
			return msg.channel.send(`I set the volume to: **${args[1]}** 🔊`);
		} else if (command === 'np') {
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
			return msg.channel.send(`:musical_note: Now playing: **${serverQueue.songs[0].title}**`);
		} else if (command === 'queue') {
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
			return msg.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title} :musical_note: 
			`);
		} else if (command === 'pause') {
			if (serverQueue && serverQueue.playing) {
				serverQueue.playing = false;
				serverQueue.connection.dispatcher.pause();
				return msg.channel.send(':pause_button: Paused the music for you!');
			}
			return msg.channel.send(':x: There is nothing playing.');
		} else if (command === 'resume') {
			if (serverQueue && !serverQueue.playing) {
				serverQueue.playing = true;
				serverQueue.connection.dispatcher.resume();
				return msg.channel.send(':play_pause: Resumed the music for you!');
			}
			return msg.channel.send(':x: There is nothing playing.');
		}
		if (msg.content === `${PREFIX}`) return;
		msg.channel.send(':x: Unknown command! Type -help for the list of commands!')
		return undefined;
	}
	if (msg.content === `${PREFIX}`) return;
	var coms = ['-play','-queue','-np','-volume','-pause','-resume','-stop','-skip']
	for (var i = 0; i < coms.length; i++) {
	if (msg.content.includes(coms[i])) {
		if (!msg.member.roles.find(x => x.name === 'DJ')) {
			msg.channel.send(':x: i\'m sorry but you need to have the \'DJ\' role to use music commands!')
			return;
		}
		}
	}
	msg.channel.send(':x: Unknown command! Type -help for the list of commands!')
	return;
	}
	else {
		const args = msg.content.split(' ');
		const searchString = args.slice(1).join(' ');
		const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
		const serverQueue = queue.get(msg.guild.id);
	
		let command = msg.content.toLowerCase().split(' ')[0];
		command = command.slice(PREFIX.length)
	
		if (command === 'play') {
			if (!args[1]) return msg.channel.send(':x: I think you forgot what you wanted to play!');
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel) return msg.channel.send(':x: I\'m sorry but you need to be in a voice channel to play music!');
			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) {
				return msg.channel.send(':x: I cannot connect to your voice channel, make sure I have the proper permissions!');
			}
			if (!permissions.has('SPEAK')) {
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
							console.error(err);
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
		} else if (command === 'skip') {
			if (!msg.member.voiceChannel) return msg.channel.send(':x: You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing that I could skip for you.');
			msg.channel.send('Skipped :thumbsup:')
			serverQueue.connection.dispatcher.end('Skipped');
			return undefined;
		} else if (command === 'stop') {
			if (!msg.member.voiceChannel) return msg.channel.send(':x: You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing that I could stop for you.');
			msg.channel.send('Stopped the music! :stop_button:')
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end('Stopped!');
			return undefined;
		} else if (command === 'volume') {
			if (!msg.member.voiceChannel) return msg.channel.send(':x: You are not in a voice channel!');
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
			if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}** :speaker:`);
			if (isNaN(args[1])) {
				return msg.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.')
			}
			serverQueue.volume = args[1];
			serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
			return msg.channel.send(`I set the volume to: **${args[1]}** 🔊`);
		} else if (command === 'np') {
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
			return msg.channel.send(`:musical_note: Now playing: **${serverQueue.songs[0].title}**`);
		} else if (command === 'queue') {
			if (!serverQueue) return msg.channel.send(':x: There is nothing playing.');
			return msg.channel.send(`
	__**Song queue:**__
	${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
	**Now playing:** ${serverQueue.songs[0].title} :musical_note: 
			`);
		} else if (command === 'pause') {
			if (serverQueue && serverQueue.playing) {
				serverQueue.playing = false;
				serverQueue.connection.dispatcher.pause();
				return msg.channel.send(':pause_button: Paused the music for you!');
			}
			return msg.channel.send(':x: There is nothing playing.');
		} else if (command === 'resume') {
			if (serverQueue && !serverQueue.playing) {
				serverQueue.playing = true;
				serverQueue.connection.dispatcher.resume();
				return msg.channel.send(':play_pause: Resumed the music for you!');
			}
			return msg.channel.send(':x: There is nothing playing.');
		}
	}
	if (msg.content === `${PREFIX}`) {
		return undefined;
	}
	msg.channel.send(':x: Unknown command! Type -help for the list of commands!')
	return undefined;
	}
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`:x: I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`:white_check_mark: **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url, { quality: `highestaudio`, filter: 'audioonly' }))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(1 / 5);
	serverQueue.volume = 1

	serverQueue.textChannel.send(`:musical_note: Start playing: **${song.title}**`);
}

client.login(process.env.BOT_TOKEN);
