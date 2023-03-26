const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getchannel")
    .setDescription("Retrieves your channel ID"),
  async execute(interaction) {
    const prompt = interaction.options.getString("id");
    await interaction.reply(`Here's your channel ID **${interaction.channelId}**`);
  },
};
