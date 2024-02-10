const { ShardingManager} = require("discord.js");
const config = require("./src/config/config.js");
const DiscordWebhook = require("discord-webhook-node");

if (config.devMode) {
  console.log("- dev mode- ");
  config.shards = 1;
}

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

const oldConsole = {};
oldConsole.log = console.log;
console.log = function (arg) {
  oldConsole.log(arg);
};

oldConsole.error = console.error;
console.error = function (arg) {
  oldConsole.error(arg);
};
