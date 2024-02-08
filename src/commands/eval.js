module.exports = {
    name: 'eval',
    alias: ["none"],
    usage: '<code>',
    description: 'Evaluation command. DEV ONLY!',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, command) {
        const input = msg.content.slice(client.global.db.guilds[msg.guild.id].prefix.length + 5);
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