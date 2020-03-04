module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, oldState, newState) {
        const serverQueue = client.queue.get(newState.guild.id);
        if (!serverQueue) return;
        if (newState.member.id === client.user.id && oldState.member.id === client.user.id) {
            if (newState.member.voice.channel === null) {
                serverQueue.songs = [];
                serverQueue.looping = false;
                serverQueue.endReason = "manual disconnect";
                return client.queue.delete(newState.guild.id);
            }
            if (newState.member.voice.channel !== serverQueue.voiceChannel) {
                serverQueue.voiceChannel = newState.member.voice.channel;
                serverQueue.connection = newState.connection;
                return;
            }
        }
    }
}
