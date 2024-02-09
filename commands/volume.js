const { PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: 'volume',
	description: 'Volume command.',
	alias: 'volume',
	cooldown: 5,
	execute(message, args, client, Discord, prefix) {
		const voiceChannel = message.member.voice.channel;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		if (!serverQueue.playing) return message.channel.send(':x: There is nothing playing.');
		if (!args[1]) return message.channel.send(`:loud_sound: The current volume is: **${serverQueue.volume}**`);
		const volume = parseFloat(args[1]);
		if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to change the volume!');
		if (client.global.db.guilds[message.guild.id].permissions === true) {
			if (client.global.db.guilds[message.guild.id].dj) {
				if (!message.member.roles.cache.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to change the volume!');
			} else if (!permissions.has(PermissionFlagsBits.ManageChannels)) return message.channel.send(':x: You need the `MANAGE_CHANNELS` permission to change the volume!');
		}
		if (isNaN(volume)) return message.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.');
		if (volume > 100) return message.channel.send(':x: The max volume is `100`!');
		if (volume < 0) return message.channel.send(':x: The volume needs to be a positive number!');
		serverQueue.volume = volume;
		serverQueue.audioResource.volume.setVolume(volume / 100);
		return message.channel.send(`:loud_sound: I set the volume to: **${volume}**`);
	}
};
