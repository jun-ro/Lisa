const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("removechannel")
    .setDescription("Removes a channel ID from the global channel ID list.")
    .addStringOption((option) =>
      option
        .setName("channelid")
        .setDescription("The ID of the channel to remove.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const channelIdToRemove = interaction.options.getString("channelid");

    fs.readFile("./data/global/channels.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return interaction.reply(
          "An error occurred while removing the channel."
        );
      }

      const channels = JSON.parse(data);
      channels.channelIds = channels.channelIds.filter(
        (id) => id !== channelIdToRemove
      );

      fs.writeFile("./data/global/channels.json", JSON.stringify(channels), "utf8", (err) => {
        if (err) {
          console.error(err);
          return interaction.reply(
            "An error occurred while removing the channel."
          );
        }

        return interaction.reply(
          `Channel ID **${channelIdToRemove}** removed successfully.`
        );
      });
    });
  },
};
