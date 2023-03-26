const { Collection, REST, Routes, Events } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

//const { REST, Routes } = require('discord.js');

class CommandHandlers {
  constructor(client) {
    this.client = client;
  }
  handle(folder) {
    this.client.commands = new Collection();
    const commandsPath = path.join(folder, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    return commandFiles;
  }
  load(commandsPath, commandFiles) {
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        this.client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
  execute() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });
  }
  deploy(folder, clientId) {
    const commands = [];
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(folder, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const command = require(`${commandsPath}/${file}`);
      commands.push(command.data.toJSON());
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    // and deploy your commands!
    (async () => {
      try {
        console.log(
          `Started refreshing ${commands.length} application (/) commands.`
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationCommands(clientId), {
          body: commands,
        });

        console.log(
          `Successfully reloaded ${data.length} application (/) commands.`
        );
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
      }
    })();
  }
}

module.exports = CommandHandlers;
