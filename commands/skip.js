const { PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: 'skip',
	description: 'Skip command.',
	alias: 's',
	cooldown: 5,
	execute(message, args, client, prefix) {
		const voiceChannel = message.member.voice.channel;
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		if (!serverQueue) return message.channel.send(':x: There is nothing playing that I could skip for you.');
		if (!serverQueue.playing) return message.channel.send(':x: There is nothing playing that I could skip for you.');
		if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to skip the song!');
		if (client.global.db.guilds[message.guild.id].permissions === true) {
			if (!message.member.roles.cache.has(client.global.db.guilds[message.guild.id].djrole) && !permissions.has(PermissionFlagsBits.ManageMessages)) {
				return vote(serverQueue, message, client);
			} else {
				return skipSong(serverQueue, message);
			}
		} else {
			return vote(serverQueue, message, client);
		}
	}
};
function skipSong(serverQueue, message) {
	message.channel.send(':fast_forward: Skipped the song!');
	serverQueue.audioPlayer.stop();
};
function vote(serverQueue, message) {
	serverQueue.votesNeeded = Math.floor(serverQueue.voiceChannel.members.size / 2);
	serverQueue.votesNeeded.toFixed();
	if (serverQueue.voiceChannel.members.size > 2) {
		if (serverQueue.voters.includes(message.member.id)) return message.channel.send(':x: You have already voted to skip!');
		serverQueue.votes++;
		serverQueue.voters.push(message.member.id);
		if (serverQueue.votes >= serverQueue.votesNeeded) {
			serverQueue.voters = [];
			serverQueue.votes = 0;
			serverQueue.votesNeeded = null;
			return skipSong(serverQueue, message);
		} else return message.channel.send(`:x: Not enough votes! ${serverQueue.votes} / ${serverQueue.votesNeeded}!`);
	} else {
		return skipSong(serverQueue, message);
	}
};
