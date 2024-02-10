module.exports = {
	name: 'stop',
	description: 'Stop the music and clear the queue.',
	alias: ["none"],
	usage: '',
	permission: 'MANAGE_CHANNELS',
	category: 'music control',
	execute(msg, args, client, command) {
		const queue = client.queue.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
			if (msg.content.includes("-force")) {
				if (queue) {
					queue.voiceChannel.leave();
					queue.exists = false;
				}
				if (msg.guild.voice.channel) msg.guild.voice.channel.leave();
				client.queue.delete(msg.guild.id);
				return msg.channel.send(client.messages.stop);
			}
			if (!queue || !queue.playing) {
				return msg.channel.send(client.messages.noServerQueue);
			}
			queue.songs = [];
			queue.looping = false;
			queue.endReason = "stop";
			queue.connection.dispatcher.end();
			msg.channel.send(client.messages.stop);
		}
	}
};
