module.exports = {
    name: 'ping',
    description: 'Ping command.',
    cooldown: 5,
    execute(message, args, client, RichEmbed) {
        return message.channel.send(`My current Ping: **${Math.floor(client.ping * 10) / 10} ms**.`);
    }
};