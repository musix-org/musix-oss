const { PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: 'stop',
	description: 'Stop command.',
	alias: 'stop',
	cooldown: 5,
	execute(message, args, client, prefix) {
		const voiceChannel = message.member.voice.channel;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing that I could stop for you.');
		if (!serverQueue.playing) return message.channel.send(':x: There is nothing playing that I could stop for you.');
		if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to stop the music!');
		if (client.global.db.guilds[message.guild.id].permissions === true) {
			if (client.global.db.guilds[message.guild.id].dj) {
				if (!message.member.roles.cache.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to stop the music!');
			} else if (!permissions.has(PermissionFlagsBits.ManageChannels)) return message.channel.send(':x: You need the `MANAGE_CHANNELS` permission to stop the music!');
		}
		serverQueue.songs = [];
		serverQueue.looping = false;
		serverQueue.audioPlayer.stop();
		message.channel.send(':stop_button: Stopped the music!')
	}
};
