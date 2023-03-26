const { SlashCommandBuilder, EmbedBuilder, Options } = require("discord.js");
const fs = require('fs');
const randomCat = require("random-cat-img");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createprofile")
    .setDescription("Creates a profile for your user ")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Which AI are you going to use?")
        .setRequired(true)
        .addChoices(
            { name: "Chizuru", value: "Chizuru" },
            { name: "Therapist", value: "Therapist" }
        )
    ),
  async execute(interaction) {
    const userid = interaction.user.id;
    const botName = interaction.client.user.username;
    const botPFP = interaction.client.user.displayAvatarURL();
    const userPFP = interaction.user.displayAvatarURL();
    const cat = await randomCat();
    const catPfp = cat.data.message;
    const option = interaction.options.getString("mode");
    const replyEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Profile has successfully been created.")
      .setAuthor({
        name: interaction.user.username,
        iconURL: userPFP,
      })
      .setDescription("Profile creation")
      .addFields(
        { name: "User ID", value: userid },
        { name: "Mode", value: option }
      )
      .setImage(catPfp)
      .setTimestamp()
      .setFooter({
        text: "Profile creation",
        iconURL: botPFP,
      });
      var data = JSON.stringify({id:userid, mode: option})
      fs.writeFileSync(`./data/users/${userid}.json`, data)
    await interaction.reply({ embeds: [replyEmbed] });
  },
};
