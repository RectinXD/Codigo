const { ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if(!command)
        return interaction.reply({
            content: "This command is outdated.",
            ephemeral: true,
        });

        if (command.developer && interaction.user.id !== "")
        return interaction.reply({
            content: "Este comando solo sirve para el desarrollador",
            ephemeral: true,
        });

        command.execute(interaction, client);
    }
}
