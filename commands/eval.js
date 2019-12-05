module.exports = {
    name: 'eval',
    description: 'Evaluation command',
    alias: 'eval',
    cooldown: 5,
    onlyDev: true,
    async execute(message, args, client, Discord, prefix) {
        const ytdl = require('ytdl-core');
        const serverQueue = client.queue.get(message.guild.id);
        if (serverQueue) {
            let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
        }
        const input = message.content.slice(prefix.length + 4);
        let output;
        try {
            output = await eval(input);
        } catch (error) {
            output = error.toString();
        }
        const embed = new Discord.RichEmbed()
            .setTitle('Evaluation Command')
            .setColor(client.config.embedColor)
            .setDescription(`Input: \`\`\`js\n${input.replace(/; /g, ';').replace(/;/g, ';\n')}\n\`\`\`\nOutput: \`\`\`\n${output}\n\`\`\``);
        return message.channel.send(embed);
    },
};
