module.exports = {
	name: 'pause',
	description: 'Pause command.',
	cooldown: 5,
	execute(message, args, client, Discord, prefix) {
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		const { voiceChannel } = message.member;
		if (serverQueue && serverQueue.playing === true) {
			if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voiceChannel as Musix to pause the music!');
			if (message.author.id !== '360363051792203779') {
				if (client.global.db.guilds[message.guild.id].permissions === true) {
					if (!permissions.has('MANAGE_MESSAGES')) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to pause the music!');
				}
			}
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music!');
		}
		return message.channel.send(':x: There is nothing playing.');
	}
};