module.exports = {
	name: 'pause',
	alias: ["none"],
	usage: '',
	description: 'Pause the currently playing music.',
	permission: 'MANAGE_MESSAGES',
	category: 'music control',
	execute(msg, args, client, command) {
		const queue = client.queue.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
			if (queue.paused) return msg.channel.send(client.messages.alreadyPaused);
			queue.paused = true;
			queue.connection.dispatcher.pause(true);
			return msg.channel.send(client.messages.paused);
		}
	}
};
