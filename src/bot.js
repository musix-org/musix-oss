const MusicClient = require("./client.js");
const DiscordWebhook = require("discord-webhook-node");
const client = new MusicClient({});

const oldConsole = {};
oldConsole.log = console.log;
console.log = function (arg) {
  oldConsole.log(arg);
};

oldConsole.error = console.error;
console.error = function (arg) {
  oldConsole.error(arg);
};
