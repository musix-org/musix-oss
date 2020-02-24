module.exports = {
	name: 'pause',
	alias: 'none',
	usage: '',
	description: 'Pause the currently playing music.',
	onlyDev: false,
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const serverQueue = client.queue.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
			if (serverQueue.paused) return msg.channel.send('<:redx:674263474704220182> The music is already paused!');
			serverQueue.paused = true;
			serverQueue.connection.dispatcher.pause(true);
			return msg.channel.send('<:pause:674685548610322462> Paused the music!');
		}
	}
};
