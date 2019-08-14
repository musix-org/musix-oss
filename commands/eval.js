module.exports = {
    name: 'eval',
    description: 'Evaluation command',
    cooldown: 5,
    async execute(message, args, client, RichEmbed) {
        const serverQueue = client.queue.get(message.guild.id);
        const status = process.env.hosted
        if (message.author.id !== '360363051792203779') return message.channel.send(':x: You are not allowed to do that!');
        const input = message.content.slice(6)
        let output;
        try {
            output = await eval(input);
        } catch (error) {
            output = error.toString();
            embed.setColor('#FF0000');
        }
        const embed = new RichEmbed()
            .setTitle('Evaluation Command')
            .setColor('#b50002')
            .setDescription(`Input: \`\`\`js\n${input.replace(/; /g, ';').replace(/;/g, ';\n')}\n\`\`\`\nOutput: \`\`\`\n${output}\n\`\`\``);
        return message.channel.send(embed);
    },
};