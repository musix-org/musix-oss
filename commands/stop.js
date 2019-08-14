module.exports = {
	name: 'stop',
	description: 'Stop command.',
	cooldown: 5,
	execute(message, args, client, RichEmbed) {
		const { voiceChannel } = message.member;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing that I could stop for you.');
		if (message.author.id !== '360363051792203779') {
			if (!voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in a voice channel to stop the music!');
			if (!permissions.has('MANAGE_CHANNELS')) return message.channel.send(':x: You need the `MANAGE_CHANNELS` permission to stop the music!');
		}
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		message.channel.send(':stop_button: Stopped the music for you!')
	}
};
