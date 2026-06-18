const { Rcon } = require("rcon-client");
const { EmbedBuilder } = require("discord.js");
const shutdownEmbed = new EmbedBuilder()
  .setTitle("Server Shutdown")
  .setDescription(
    "The Minecraft server will be shut down in 15 minutes due to inactivity, if a user joins the server before then, the shutdown will be cancelled.",
  )
  .setColor(0xff0000); //Say its 15 but actuall 15.55 for one last check to register after 15 mins
const cancelShutdownEmbed = new EmbedBuilder()
  .setTitle("Shutdown Cancelled")
  .setDescription(
    "A user has joined the Minecraft server, the scheduled shutdown has been cancelled.",
  )
  .setColor(0x00ff00);
const stopEmbed = new EmbedBuilder()
  .setTitle("Server Stopped")
  .setDescription("The Minecraft server has been stopped due to inactivity.")
  .setColor(0xff0000);
const logChannel = require("../../../control.json").mcchannelId;
module.exports = async (client) => {
  client.mcServerHandler = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const config = {
      host: process.env.serverIP,
      port: 25575,
      password: process.env.RCON_PASSWORD,
    };
    let serverStatusInterval = null;
    try {
      const rcon = await Rcon.connect(config);
      client.rcon = rcon;
      console.log("RCON connection established.");
      let shutdownTimeout = null;
      rcon.on("error", (err) => {
        console.error("RCON error:", err);
      });
      rcon.on("end", () => {
        console.log("RCON connection closed.");
        client.rcon = null;
        if (shutdownTimeout) {
          clearTimeout(shutdownTimeout);
          shutdownTimeout = null;
        }
        if (serverStatusInterval) {
          clearInterval(serverStatusInterval);
          serverStatusInterval = null;
        }
      });
      
      const checkServerStatus = async () => {
        try {
          const response = await rcon.send("list");
          const isOnline = !response.includes("There are 0 of a max");
          client.emit("mcServerStatus", isOnline);
          if (!isOnline && !shutdownTimeout) {
            client.channels
              .fetch(logChannel)
              .then((channel) => {
                channel.send({ embeds: [shutdownEmbed] });
              })
              .catch((err) => {
                console.error("Failed to send shutdown message:", err);
              });
            shutdownTimeout = setTimeout(
              () => {
                client.channels
                  .fetch(logChannel)
                  .then((channel) => {
                    channel.send({ embeds: [stopEmbed] });
                  })
                  .catch((err) => {
                    console.error("Failed to send stop message:", err);
                  });
                client.stopServer();
              },
              15.55 * 60 * 1000, 
            );
          }
          if (isOnline && shutdownTimeout) {
            client.channels
              .fetch(logChannel)
              .then((channel) => {
                channel.send({ embeds: [cancelShutdownEmbed] });
              })
              .catch((err) => {
                console.error("Failed to send cancel shutdown message:", err);
              });
            clearTimeout(shutdownTimeout);
            shutdownTimeout = null;
          }
        } catch (err) {
          console.error("Error checking server status:", err);
          client.emit("mcServerStatus", false);
          if (serverStatusInterval) clearInterval(serverStatusInterval);
        }
      };
      serverStatusInterval = setInterval(checkServerStatus, 30000);
    } catch (err) {
      console.error("Failed to connect to RCON:", err);
      client.rcon = null;
      client.emit("mcServerStatus", false);
    }
  };
};
