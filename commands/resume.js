module.exports = {
	name: 'resume',
	description: 'Resume command.',
	cooldown: 5,
	execute(message, args, client, Discord, prefix) {
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		const { voiceChannel } = message.member;
		if (serverQueue && !serverQueue.playing) {
			if (message.author.id !== '360363051792203779') {
				if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voiceChannel as Musix to loop the queue!');
				if (client.global.db.guilds[message.guild.id].permissions === true) {
					if (!permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to resume the music!');
				}
			}
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music!');
		}
		return message.channel.send(':x: The music is not paused!');
	}
};
