module.exports = {
	name: 'stop',
	description: 'Stop command.',
	alias: 'none',
	onlyDev: false,
	permission: 'MANAGE_CHANNELS',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const serverQueue = client.queue.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
			serverQueue.songs = [];
			serverQueue.looping = false;
			serverQueue.connection.dispatcher.end('Stopped');
			msg.channel.send('<:stop:674685626108477519> Stopped the music!')
		}
	}
};
