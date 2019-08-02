const fs = require('fs');
const { join } = require('path');
const { Util } = require('discord.js');
const { Collection, Client, RichEmbed } = require('discord.js');
const client = new Client({ disableEveryone: true, disabledEvents: ['TYPING_START'] });
const ytdl = require('ytdl-core');
client.commands = new Collection();
client.cooldowns = new Collection();
client.queue = new Map();
client.config = {
	token: process.env.BOT_TOKEN,
	prefix: '-',
};

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	client.user.setActivity('V2 | -help', { type: 'LISTENING' })
	client.user.setStatus('dnd');
});
client.on('message', message => {
	if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
	const args = message.content.slice(client.config.prefix.length).split(' ');
	const commandName = args[0].toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command && message.content !== `${client.config.prefix}`) return message.channel.send(`:x: That is not a valid command ${message.author}! Type ${client.config.prefix}help for a list of commands!`);
	if (command.guildOnly && message.channel.type !== 'text') return message.reply(':x: I can\'t execute that command inside DMs!');
	if (command.args && !args.length) {
		let reply = `:x: You didn't provide any arguments, ${message.author}!`;
		if (command.usage) reply += `\nThe proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``;
		return message.channel.send(reply);
	}
	if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new Collection());
	}
	const now = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`:hourglass_flowing_sand: please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, client, RichEmbed);
	} catch (error) {
		console.error(error);
		message.reply(':x: there was an error trying to execute that command!');
	}
});

client.handleVideo = async function (video, message, voiceChannel, playlist = false) {
	const serverQueue = client.queue.get(message.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queueConstruct.songs.push(song);
		client.queue.set(message.guild.id, queueConstruct);


		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			client.queue.delete(message.guild.id);
			return message.channel.send(`:x: I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else
			return message.channel.send(`:white_check_mark: **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = client.queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		client.queue.delete(guild.id);
		return;
	}
	const dispatcher = serverQueue.connection
		.playStream(ytdl(song.url, { quality: `highestaudio`, filter: "audioonly" }), { seek: 0 })
		.on("end", reason => {
			if (reason === "Stream is not generating quickly enough.")
				console.log("Song ended");
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
	dispatcher.setVolumeLogarithmic(1 / 5);
	serverQueue.volume = 1
	dispatcher.on("error", error => console.error(error));

	serverQueue.textChannel.send(`:musical_note: Start playing: **${song.title}**`);
}

client.login(client.config.token);
