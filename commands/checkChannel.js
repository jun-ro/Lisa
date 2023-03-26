const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkchannel')
		.setDescription('Check if your channel is in the global channels list'),
	async execute(interaction) {
        try{
            const data = fs.readFileSync('./data/global/channels.json');
            const channels = JSON.parse(data);
            if(channels.channelIds.includes(interaction.channelId)){
                await interaction.reply(`Your channel is already stored!.`)
            }
            else{
                await interaction.reply(`Your channel has not been stored, if you'd like to store your channel please do **/addchannel** 
                \n If you'd like to remove your channel, please do **/removechannel**`)
            }
        }
        catch(err){
            console.log(err);
        }
	},
};