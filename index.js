const Discord = require('discord.js');
const { Collection, Client, RichEmbed } = require('discord.js');
const client = new Discord.Client({ disableEveryone: true, disabledEvents: ['TYPING_START'] });
const ytdl = require('ytdl-core');
const fs = require('fs');
const dotenv = require('dotenv');
const firebase = require('firebase/app');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
require('dotenv/config');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

client.db = admin.firestore();
client.db.FieldValue = require('firebase-admin').firestore.FieldValue;
client.commands = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.queue = new Map();
client.funcs = {};

client.funcs.setPrefix = require('./funcs/setPrefix.js');

client.funcs.handleVideo = require('./funcs/handleVideo.js');

client.funcs.play = require('./funcs/play.js');

client.config = {
  token: process.env.MUSIX_TOKEN,
  apikey: process.env.API_KEY,
  prefix: '>',
  test: 'success',
};
const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.events.set(event.name, event);
}

client.on('ready', async () => {
  const eventName = 'ready';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client);
});

client.on('message', message => {
  const eventName = 'message';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client, message);
});

client.on('guildCreate', async (guild) => {
  const eventName = 'guildcreate';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client, guild);
});

client.on('guildDelete', (guild) => {
  const eventName = 'guilddelete';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client, guild);
});

client.on('guildMemberRemove', () => {
  const eventName = 'guildmemberremove';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client);
});

client.on('guildMemberAdd', () => {
  const eventName = 'guildmemberadd';
  const event = client.events.get(eventName) || client.events.find(ent => ent.aliases && ent.aliases.includes(eventName));
  event.execute(client);
});

client.login(client.config.token);
