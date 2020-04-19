module.exports = {
  name: "setkey",
  async execute(msg, args, client) {
    msg.channel.send(client.messages.setKeyUsage);
  },
};
