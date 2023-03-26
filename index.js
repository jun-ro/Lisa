const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { MessageListener, CommandHandlers } = require("./stardust/index.js");
const { Chizuru, Therapist } = require('./modules/index.js')
const { clientId } = require("./config.json");
require("dotenv").config();


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

//AI Classes
const chizuru = new Chizuru();
const therapist = new Therapist();

async function init() {
  await chizuru.init();
  await therapist.init();
  console.log("AIs initialized");
}

init();

const listener = new MessageListener(client);
const commandHandlers = new CommandHandlers(client);

//Setting up Commands using Stardust API
const commandFiles = commandHandlers.handle(__dirname);
commandHandlers.load(path.join(__dirname, "commands"), commandFiles);
commandHandlers.deploy(__dirname, clientId);
commandHandlers.execute();





//Listens for any message in any channel.
listener.listen(async (message) => {
  if (message.author.bot) return;
  const userId = message.author.id;
  var channelId = message.channel.id;
  async function getProfile() {
    return new Promise((resolve, reject) => {
      fs.readdir("./data/users", (err, files) => {
        if (err) {
          reject(err);
        } else {
          files.forEach((file) => {
            if (file === `${userId}.json`) {
              const data = fs.readFileSync(`./data/users/${userId}.json`, "utf8");
              const json = JSON.parse(data);
              var type_ai = json.mode;
              resolve(type_ai);
            }
          });
          // If file not found, reject with an error
          reject(new Error(`Profile not found for user ${userId}`));
        }
      });
    });
  }
  var mode = await getProfile();

  var channelTable = fs.readFileSync("./data/global/channels.json", "utf8")
  var jsonChannelTable = JSON.parse(channelTable);
  var channelIds = jsonChannelTable.channelIds
  for(let i = 0; i < channelIds.length; i++){
    if(channelId === channelIds[i]){
      if(mode === "Chizuru"){
        await chizuru.init();

        var response = await chizuru.generate(message.content)
        message.reply(response)
      }
      else if(mode === "Therapist"){
        var response = await therapist.generate(message.content)
        message.reply(response);
      }
      break;
    }
  }
});


client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN);
