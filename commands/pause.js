module.exports = {
	name: 'pause',
	description: 'Pause command.',
	cooldown: 5,
	execute(message, args, client, RichEmbed) {
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (serverQueue && serverQueue.playing === true) {
			if (message.author.id !== '360363051792203779') {
				if (!permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to pause the music!');
			}
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
		}
		return message.channel.send(':x: There is nothing playing.');
	}
};