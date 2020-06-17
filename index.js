const config = require("./src/struct/config/config.js");
const DiscordWebhook = require("discord-webhook-node");

if (config.devMode) {
  console.log("- dev mode- ");
  config.token = config.devToken;
  config.shards = 1;
}

const { ShardingManager } = require("discord.js");
const manager = new ShardingManager("./src/bot.js", {
  token: config.token,
  respawn: config.respawn,
  totalShards: config.shards,
});

console.log("- Launching shards -");
manager.spawn(config.shards, config.shardDelay, config.shardTimeout);
manager.on("shardCreate", (shard) =>
  console.log(`- Launched shard ${shard.id} -`)
);

const webhookClient = new DiscordWebhook.Webhook(config.webhookUrl);

const oldConsole = {};
oldConsole.log = console.log;
console.log = function (arg) {
  oldConsole.log(arg);
  if (!config.devMode) webhookClient.send(arg);
};
