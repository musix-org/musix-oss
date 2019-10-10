module.exports = {
	name: 'stop',
	description: 'Stop command.',
	cooldown: 5,
	execute(message, args, client, Discord, prefix) {
		const { voiceChannel } = message.member;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing that I could stop for you.');
		if (message.author.id !== '360363051792203779') {
			if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voiceChannel as Musix to stop the music!');
			if (client.global.db.musix_guilds[message.guild.id].permissions === true) {
				if (!permissions.has('MANAGE_CHANNELS')) return message.channel.send(':x: You need the `MANAGE_CHANNELS` permission to stop the music!');
			}
		}
		serverQueue.songs = [];
		serverQueue.looping = false;
		serverQueue.connection.dispatcher.end('Stopped');
		message.channel.send(':stop_button: Stopped the music!')
	}
};
