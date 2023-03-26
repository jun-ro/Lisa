const { Client, Message } = require('discord.js');

class MessageListener {
  constructor(client) {
    if (!(client instanceof Client)) {
      throw new TypeError('The "client" parameter must be a Discord.js Client instance.');
    }
    this.client = client;
  }

  listen(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('The "callback" parameter must be a function.');
    }

    this.client.on('messageCreate', (message) => {
      callback(message);
    });
  }
}

module.exports = MessageListener;