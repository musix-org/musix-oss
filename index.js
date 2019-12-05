const Discord = require('discord.js');
const MusicClient = require('./Struct/Client');
const client = new MusicClient({});
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DBLTOKEN, client);
const fs = require('fs');
require('dotenv/config');

client.config = require('./config/config.js');

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  command.uses = 0;
  client.commands.set(command.name, command);
  client.commandAliases.set(command.alias, command);
}

const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.events.set(event.name, event);
}

const playlistFiles = fs.readdirSync('./commands/playlist/').filter(f => f.endsWith('.js'));
for (const file of playlistFiles) {
  const option = require(`./commands/playlist/${file}`);
  client.playlistCmd.set(option.name, option);
}

const settingFiles = fs.readdirSync('./commands/settings/').filter(f => f.endsWith('.js'));
for (const file of settingFiles) {
  const option = require(`./commands/settings/${file}`);
  client.settingCmd.set(option.name, option);
}

client.on('ready', async () => {
  const eventName = 'ready';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client, dbl);
});

client.on('message', message => {
  const eventName = 'message';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client, message, Discord);
});

client.on('guildCreate', async (guild) => {
  const eventName = 'guildcreate';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client, guild);
});

dbl.on('error', error => {
  console.log(`Error with DBL! ${error}`);
})
client.login(client.config.token).catch(err => { console.log('- Failed To Login -> ' + err); });
