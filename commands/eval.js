module.exports = {
    name: 'eval',
    description: 'Evaluation command',
    alias: 'eval',
    cooldown: 5,
    async execute(message, args, client, Discord, prefix) {
        const ytdl = require('ytdl-core');
        const serverQueue = client.queue.get(message.guild.id);
        if (serverQueue) {
            let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
        }
        if (message.author.id !== client.config.devId) return message.channel.send(':x: You are not allowed to do that!');
        const input = message.content.slice(prefix.length + 4);
        let output;
        try {
            output = await eval(input);
        } catch (error) {
            output = error.toString();
        }
        const embed = new Discord.RichEmbed()
            .setTitle('Evaluation Command')
            .setColor('#b50002')
            .setDescription(`Input: \`\`\`js\n${input.replace(/; /g, ';').replace(/;/g, ';\n')}\n\`\`\`\nOutput: \`\`\`\n${output}\n\`\`\``);
        return message.channel.send(embed);
    },
};
