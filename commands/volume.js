module.exports = {
	name: 'volume',
	description: 'Volume command.',
	cooldown: 5,
	execute(message, args, client, RichEmbed) {
		const { voiceChannel } = message.member;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (message.author.id === '384002606621655040') return msg.channel.send('You are not doying that!');
		if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		if (!args[1]) return message.channel.send(`:loud_sound: The current volume is: **${serverQueue.volume}**`);
		if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to change the volume!');
		if (!permissions.has('MANAGE_CHANNELS')) return message.channel.send(':x: You need the `MANAGE_CHANNELS` permission to change the volume!');
		if (isNaN(args[1])) return msg.channel.send(':x: I\'m sorry, But you need to enter a valid __number__.');
		serverQueue.volume = args[1]; // eslint-disable-line
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return message.channel.send(`:loud_sound: I set the volume to: **${args[1]}**`);
	}
};
