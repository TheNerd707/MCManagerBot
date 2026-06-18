const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const ping = require("ping");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("startserver")
    .setDescription("Starts the Minecraft server."),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Starting Minecraft Server")
      .setDescription("The Minecraft server is now starting...")
      .setColor(0x00ff00);
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    const serverIP = process.env.serverIP;
    const pingResponse = await ping.promise.probe(serverIP, {
      timeout: 10,
    });
    if (!pingResponse.alive) {
      const offlineEmbed = new EmbedBuilder()
        .setTitle("Computer Offline")
        .setDescription(`Please contact @the_nerd1 to start the computer.`)
        .setColor(0xff0000);
      await interaction.editReply({ embeds: [offlineEmbed] });
      return;
    }

    const bearerToken = process.env.BEARER_TOKEN;
    let response;
    try {
      const res = await fetch(`http://${serverIP}:3000/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      response = { success: res.ok, body: await res.text() };
    } catch (err) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error Starting Server")
        .setDescription(
          `An error occurred while trying to start the server: ${err.message}`,
        )
        .setColor(0xff0000);
      await interaction.editReply({ embeds: [errorEmbed] });
      return;
    }

    if (response?.success) {
      const successEmbed = new EmbedBuilder()
        .setTitle("Server Starting")
        .setDescription(
          "The Minecraft server is now starting. Please wait for the start message in https://discord.com/channels/1516933397094596699/1516937976918180011 before trying to connect."
        )
        .setColor(0x00ff00);
      await interaction.editReply({ embeds: [successEmbed] });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error Starting Server")
        .setDescription("The server start request did not return a successful response.")
        .setColor(0xff0000);
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
