module.exports = {
    name: 'help',
    alias: 'h',
    usage: '<command(opt)>',
    description: 'See the help for Musix.',
    onlyDev: false,
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, prefix, command) {
        if (args[1]) {
            if (!client.commands.has(args[1]) || (client.commands.has(args[1]) && client.commands.get(args[1]).omitFromHelp === true && msg.guild.id !== '489083836240494593')) return msg.channel.send('That command does not exist');
            const command = client.commands.get(args[1]);
            const embed = new Discord.MessageEmbed()
                .setTitle(`${client.global.db.guilds[msg.guild.id].prefix}${command.name} ${command.usage}`)
                .setDescription(command.description)
                .setFooter(`${client.messages.helpCmdFooter} \`${command.alias}\``)
                .setColor(client.config.embedColor)
            msg.channel.send(embed);
        } else {
            const categories = [];
            for (let i = 0; i < client.commands.size; i++) {
                if (!categories.includes(client.commands.array()[i].category)) categories.push(client.commands.array()[i].category);
            }
            let commands = '';
            for (let i = 0; i < categories.length; i++) {
                commands += `**» ${categories[i].toUpperCase()}**\n${client.commands.filter(x => x.category === categories[i] && !x.omitFromHelp && !x.onlyDev).map(x => `\`${x.name}\``).join(', ')}\n`;
            }
            let message;
            message = client.messages.helpFooter.replace("%PREFIX%", prefix);
            const embed = new Discord.MessageEmbed()
                .setTitle(`${client.user.username} ${client.messages.helpTitle}`)
                .setDescription(commands)
                .setFooter(message)
                .setColor(client.config.embedColor)
            msg.channel.send(embed);
        }
    }
};
