module.exports = {
    name: "guildcreate",
    async execute(client, guild) {
        delete client.global.db.guilds[guild.id];
    },
};