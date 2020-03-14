module.exports = {
    name: 'eval',
    alias: 'e',
    usage: '<code>',
    description: 'Evaluation command. DEV ONLY!',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, prefix, command) {
        const ytdl = require('ytdl-core');
        const queue = client.queue.get(msg.guild.id);
        let data;
        if (queue) {
            data = await Promise.resolve(ytdl.getInfo(queue.songs[0].url));
        }
        const input = msg.content.slice(prefix.length + 4);
        let output;
        try {
            output = await eval(input);
        } catch (error) {
            output = error.toString();
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.evalTitle)
            .setColor(client.config.embedColor)
            .setDescription(`Input: \`\`\`js\n${input.replace(/; /g, ';').replace(/;/g, ';\n')}\n\`\`\`\nOutput: \`\`\`\n${output}\n\`\`\``);
        return msg.channel.send(embed);
    },
};
