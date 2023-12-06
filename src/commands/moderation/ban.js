const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('utilizador').value;
        const requestUserId = interaction.member.id;
        const requestUser = await interaction.guild.members.fetch(requestUserId);
        const reason = interaction.options.get('motivo')?.value || `${requestUser} não quis dizer a gente 😔`;

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("Utilizador inválido.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("Não podes banir o reizão, burro de merda :KalliOK:");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Cargo mais alto do utilizador a ser banido
        const requestUserRolePosition = interaction.member.roles.highest.position; // Cargo mais alto do utilizador que está a executar o comando
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Cargo mais alto do bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Não podes banir este utilizador porque tens um cargo igual/menor que o dele(a).");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Não podes banir este utilizador porque tem um cargo igual/maior que o bot.");
            return;
        }

        // Bane o utilizador
        try {
            await targetUser.ban({ reason });
            await interaction.editReply(`O utilizador ${targetUser} foi banido\nMotivo: ${reason}`);
        } catch (error) {
            console.log(`There was an error when banning: ${error}`);
        }
    },

    deleted: false,
    name: 'ban',
    description: '(ADM ONLY) Bane um corno do server',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'utilizador',
            description: 'Utilizador a ser banido.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'motivo',
            description: 'Motivo do banimento (opcional).',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
};