module.exports = {
	name: 'volume',
	description: 'Volume command.',
	cooldown: 5,
	execute(message, args, client, Discord, prefix) {
		const { voiceChannel } = message.member;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (message.author.id === '384002606621655040') return message.channel.send('You are not doying that!');
		if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		if (!args[1]) return message.channel.send(`:loud_sound: The current volume is: **${serverQueue.volume}**`);
		if (message.author.id !== '360363051792203779') {
			if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to change the volume!');
			if (client.global.db.musix_guilds[message.guild.id].permissions === true) {
				if (!permissions.has('MANAGE_CHANNELS')) return message.channel.send(':x: You need the `MANAGE_CHANNELS` permission to change the volume!');
			}
			if (isNaN(args[1])) return message.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.');
			if (args[1] > 100) return message.channel.send(':x: The max volume is `100`!');
			if (args[1] < 0) return message.channel.send(':x: The volume needs to be a positive number!');
		}
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolume(args[1] / 5);
		return message.channel.send(`:loud_sound: I set the volume to: **${args[1]}**`);
	}
};
