module.exports = {
	name: 'resume',
	alias: 'none',
	usage: '',
	description: 'Resume the paused music.',
	onlyDev: false,
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const queue = client.queue.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
			if (!queue.paused) return msg.channel.send(client.messages.notPaused);
			queue.paused = false;
			queue.connection.dispatcher.resume(true);
			return msg.channel.send(client.messages.resumed);
		}
	}
};
