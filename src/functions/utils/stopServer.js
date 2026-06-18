module.exports = async (client) => {
  const serverIP = process.env.serverIP;
  const bearerToken = process.env.BEARER_TOKEN;
  client.stopServer = async () => {
    try {
      const res = await fetch(`http://${serverIP}:3000/stop`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to stop server: ${res.status}`);
      }
      console.log("Server stop request sent.");
    } catch (err) {
      console.error("Error stopping server:", err);
    }
  };
};
