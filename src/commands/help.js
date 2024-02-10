const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'help',
    alias: ["h"],
    usage: '<command(opt)>',
    description: 'See the help for Musix.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, command) {
        if (args[1]) {
            if (!client.commands.has(args[1]) || (client.commands.has(args[1]) && client.commands.get(args[1]).omitFromHelp === true && msg.guild.id !== '489083836240494593')) return msg.channel.send('That command does not exist');
            const command = client.commands.get(args[1]);
            const embed = new EmbedBuilder()
                .setTitle(`${client.global.db.guilds[msg.guild.id].prefix}${command.name} ${command.usage}`)
                .setDescription(command.description)
                .setFooter({ text:`${client.messages.helpCmdFooter} \`${command.alias.map(a => `${a}, `)}\`` })
                .setColor(client.config.embedColor)
            msg.channel.send(embed);
        } else {
            const categories = [];
            for (let i = 0; i < client.commands.size; i++) {
                if (!categories.includes(client.commands.array()[i].category)) categories.push(client.commands.array()[i].category);
            }
            let commands = '';
            for (let i = 0; i < categories.length; i++) {
                commands += `**» ${categories[i].toUpperCase()}**\n${client.commands.filter(x => x.category === categories[i] && !x.omitFromHelp).map(x => `\`${x.name}\``).join(', ')}\n`;
            }
            let message;
            message = client.messages.helpFooter.replace("%PREFIX%", client.global.db.guilds[msg.guild.id].prefix);
            const embed = new EmbedBuilder()
                .setTitle(`${client.user.username} ${client.messages.helpTitle}`)
                .setDescription(commands)
                .setFooter({ text: message })
                .setColor(client.config.embedColor)
            msg.channel.send(embed);
        }
    }
};
