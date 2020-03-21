module.exports = {
    name: 'bass',
    description: 'Bassboost command.',
    alias: 'none',
    usage: '<bass>',
    cooldown: 5,
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    execute(msg, args, client, Discord, command) {
        const queue = client.queue.get(msg.guild.id);
        if (!args[1] && queue) return msg.channel.send(`${client.messages.currentBass}**${queue.bass}**`);
        const bass = parseFloat(args[1]);
        if (client.funcs.check(client, msg, command)) {
            if (isNaN(bass)) return msg.channel.send(client.messages.validNumber);
            if (bass > 100) return msg.channel.send(client.messages.maxBass);
            if (bass < 0) return msg.channel.send(client.messages.positiveBass);
            queue.bass = bass;
            let message;
            message = client.messages.bassApplied.replace("%BASS%", bass);
            return msg.channel.send(message);
        }
    }
};
