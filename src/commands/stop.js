module.exports = {
	name: 'stop',
	description: 'Stop the music and clear the queue.',
	alias: ["none"],
	usage: '',
	onlyDev: false,
	permission: 'MANAGE_CHANNELS',
	category: 'music',
	execute(msg, args, client, Discord, command) {
		const queue = client.queue.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
			queue.songs = [];
			queue.looping = false;
			queue.endReason = "stop";
			queue.connection.dispatcher.end();
			msg.channel.send(client.messages.stop)
		}
	}
};