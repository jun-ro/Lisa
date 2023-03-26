const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addchannel")
    .setDescription("Adds a channel ID to the global channel ID list.")
    .addStringOption((option) =>
      option.setName("id").setDescription("Channel ID").setRequired(true)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("id");
    fs.readFile(
      "./data/global/channels.json", // Use the `path` property of the `channelIds` object as the file path.
      "utf8",
      (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        const channels = JSON.parse(data);
        channels.channelIds.push(prompt.toString()); // add a new channel ID to the array

        fs.writeFile(
          "./data/global/channels.json",
          JSON.stringify(channels),
          "utf8",
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      }
    );
    await interaction.reply("New channel ID added successfully");
  },
};
