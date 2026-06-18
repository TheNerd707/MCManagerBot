const { ActivityType } = require('discord.js')
const chalk = require("chalk");
const mcChannelId = require("../../../control.json").mcchannelId;
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.channel.id != mcChannelId) return;
        if (message.embeds[0]?.description === "✅ **Server is now online!**") {
            client.mcServerHandler();
        } else if (!message.webhookId && !message.author.bot) {
            if (!client.rcon) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("The Minecraft server is currently offline. Please use the `/startserver` command to start it before sending messages.")
                    .setColor(0xff0000);
                await message.reply({ embeds: [errorEmbed] });
            } else {
                try {
                    await client.rcon.send(`say [§l${message.author.username}§r]: ${message.content}`);
                } catch (err) {
                    console.error("Failed to send message to Minecraft server:", err);
                }
            }
        }
    }
}