const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setdifficulty")
    .setDescription("Sets the difficulty of the Minecraft server.")
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("The difficulty to set.")
        .setRequired(true)
        .addChoices(
          { name: "Peaceful", value: "peaceful" },
          { name: "Easy", value: "easy" },
          { name: "Normal", value: "normal" },
          { name: "Hard", value: "hard" }
        )
    ),
  async execute(interaction, client) {
    const difficulty = interaction.options.getString("difficulty");
    rcon = client.rcon;
    await rcon.send(`/difficulty ${difficulty}`);
    await interaction.reply(`Difficulty set to ${difficulty}`);
  },
};