const { PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: 'resume',
	description: 'Resume command.',
	alias: 'resume',
	cooldown: 5,
	execute(message, args, client, prefix) {
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		const voiceChannel = message.member.voice.channel;
		if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		if (serverQueue.playing && serverQueue.paused) {
			if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to loop the queue!');
			if (client.global.db.guilds[message.guild.id].permissions === true) {
				if (client.global.db.guilds[message.guild.id].dj) {
					if (!message.member.roles.cache.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to resume the music!');
				} else if (!permissions.has(PermissionFlagsBits.ManageMessages)) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to resume the music!');
			}
			serverQueue.paused = false;
			serverQueue.audioPlayer.unpause();
			return message.channel.send('▶ Resumed the music!');
		}
		return message.channel.send(':x: The music is not paused!');
	}
};
