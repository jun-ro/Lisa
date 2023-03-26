const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { Client } = require("craiyon");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("generateimage")
    .setDescription("Generates an image from your prompt!")
    .addStringOption((option) =>
      option.setName("prompt").setDescription("Prompt for image generation").setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply(`**Please wait while we're generating your image**`)
    const prompt = interaction.options.getString("prompt");
    const craiyon = new Client();
    const result = await craiyon.generate({ prompt: prompt });
    const base64Data = result._images[0].base64;
    const dataUrl = `data:image/png;base64,${base64Data}`;
    fs.writeFile("./data/cache/image.png", Buffer.from(base64Data, "base64"), async (err) => {
      if (err) {
        console.error(err);
        await interaction.followUp("An error occurred while generating the image.");
        return;
      }
      const attachment = new AttachmentBuilder("./data/cache/image.png", { name: 'image.png' });
      await interaction.editReply({
        content: `Generated Image for **${interaction.user.username}**`,
        files: [attachment]
      });
    });
  },
};
