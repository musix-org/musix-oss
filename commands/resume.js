module.exports = {
	name: 'resume',
	alias: 'none',
	usage: '',
	description: 'Resume the paused music.',
	onlyDev: false,
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const serverQueue = client.queue.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
			if (!serverQueue.paused) return msg.channel.send(client.messages.notPaused);
			serverQueue.paused = false;
			serverQueue.connection.dispatcher.resume(true);
			return msg.channel.send(client.messages.resumed);
		}
	}
};
