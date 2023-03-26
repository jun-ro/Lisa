const { SlashCommandBuilder, EmbedBuilder, User } = require("discord.js");
const fs = require("fs");
const randomCat = require("random-cat-img");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getprofile")
    .setDescription("Get your profile if you have one"),
  async execute(interaction) {
    const userid = interaction.user.id;
    const botName = interaction.client.user.username;
    const botPFP = interaction.client.user.displayAvatarURL();
    const userPFP = interaction.user.displayAvatarURL();
    const cat = await randomCat();
    const catPfp = cat.data.message;
    const Username = interaction.user.username;
    fs.readdir("./data/users", (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach((file) => {
          if (file === `${interaction.user.id}.json`) {
            const data = fs.readFileSync(
              `./data/users/${interaction.user.id}.json`,
              "utf8"
            );
            var json = JSON.parse(data);
            const profileEmbed = new EmbedBuilder()
              .setColor("White")
              .setTitle(`${Username}'s profile`)
              .setAuthor({
                name: Username,
                iconURL: userPFP,
              })
              .setDescription(`${Username}'s Profile`)
              .addFields(
                { name: "User ID", value: userid },
                { name: "Mode", value: json.mode }
              )
              .setImage(catPfp)
              .setTimestamp()
              .setFooter({
                text: `${Username}'s Profile`,
                iconURL: botPFP,
              });
            interaction.reply({ embeds: [profileEmbed] });
          } else {
            async function reply() {
              await interaction.reply(`You have not created a profile yet`);
            }
            reply();
          }
        });
      }
    });
  },
};
