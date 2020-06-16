const MusicClient = require("./struct/client.js");
const DiscordWebhook = require("discord-webhook-node");
const client = new MusicClient({});
const webhookClient = new DiscordWebhook.Webhook(client.config.webhookUrl);

const oldConsole = {};
oldConsole.log = console.log;
console.log = function (arg) {
  oldConsole.log(arg);
  webhookClient.send(arg);
};
