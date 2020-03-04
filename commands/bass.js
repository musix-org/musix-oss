module.exports = {
    name: 'bass',
    description: 'Bassboost command.',
    alias: 'none',
    usage: '<bass>',
    cooldown: 5,
    onlyDev: true,
    permission: 'MANAGE_MESSAGES',
    category: 'music',
    execute(msg, args, client, Discord, prefix, command) {
        const serverQueue = client.queue.get(msg.guild.id);
        if (!args[1] && serverQueue) return msg.channel.send(`:loud_sound: The current bass is: **${serverQueue.bass}**`);
        const bass = parseFloat(args[1]);
        if (client.funcs.check(client, msg, command)) {
            if (isNaN(bass)) return msg.channel.send('<:redx:674263474704220182> I\'m sorry, But you need to enter a valid __number__.');
            if (bass > 100) return msg.channel.send('<:redx:674263474704220182> The max bass is `100`!');
            if (bass < 0) return msg.channel.send('<:redx:674263474704220182> The volume needs to be a positive number!');
            serverQueue.bass = bass;
            return msg.channel.send(`<:volumehigh:674685637626167307> The bass level **${bass}** will be applied when the next song starts playing!`);
        }
    }
};
