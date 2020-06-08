module.exports = {
	name: 'volume',
	description: 'Volume command.',
	alias: ["none"],
	usage: '<volume>',
	cooldown: 5,
	onlyDev: false,
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, command) {
		const queue = client.queue.get(msg.guild.id);
		if (!args[1] && queue) return msg.channel.send(`${client.messages.currentVolume}**${queue.volume}**`);
		const volume = parseFloat(args[1]);
		if (client.funcs.check(client, msg, command)) {
			if (isNaN(volume)) return msg.channel.send(client.messages.validNumber);
			if (volume > 100) return msg.channel.send(client.messages.maxVolume);
			if (volume < 0) return msg.channel.send(client.messages.positiveVolume);
			queue.volume = volume;
			queue.connection.dispatcher.setVolume(volume / 100);
			return msg.channel.send(`${client.messages.setVolume}**${volume}**`);
		}
	}
};