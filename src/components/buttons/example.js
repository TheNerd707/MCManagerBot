module.exports = {
    data: {
      name: 'sub-yt'
    },
    async execute(interaction, client) {
      await interaction.reply({
        content: `https://www.youtube.com/channel/UCXd6IZIctbF_LDiVPN1R0wQ`,
        ephemeral: true,
      });
    }
  };