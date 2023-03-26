const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete a specified number of messages from the channel.')
    .addIntegerOption(option =>
      option.setName('count')
      .setDescription('The number of messages to delete (up to 100).')
      .setRequired(true)
    ),
  async execute(interaction) {
    const count = interaction.options.getInteger('count');
    if (!count || count < 1 || count > 101) {
      await interaction.reply('Please provide a valid number between 1 and 100.');
      return;
    }

    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ limit: count + 1 });
    await channel.bulkDelete(messages);

    await interaction.reply(`Deleted ${messages.size - 1} messages!`);
  },
};
