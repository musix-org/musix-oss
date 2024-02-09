const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = function (message, args, client, prefix, command) {
    const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(PermissionFlagsBits.EmbedLinks)) return message.channel.send(':x: I cannot send embeds (Embed links), make sure I have the proper permissions!');
    try {
        command.uses++;
        command.execute(message, args, client, prefix);
    } catch (error) {
        message.reply(`:x: there was an error trying to execute that command!`);
        console.log(error);
    }
};
