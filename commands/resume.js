module.exports = {
	name: 'resume',
	description: 'Resume command.',
	cooldown: 5,
	execute(message, args, client, RichEmbed) {
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (serverQueue && !serverQueue.playing) {
			if (message.author.id !== '360363051792203779') {
				if (!permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to resume the music!');
			}
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}
		return message.channel.send(':x: The music is not paused!');
	}
};
