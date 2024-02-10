module.exports = {
    name: 'shuffle',
    alias: ["none"],
    usage: '',
    description: 'Shuffle the queue.',
    permission: 'MANAGE_MESSAGES',
    category: 'music control',
    execute(msg, args, client, command) {
        const queue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            client.funcs.shuffle(queue.songs);
            msg.channel.send(client.messages.shuffled);
        }
    }
};
