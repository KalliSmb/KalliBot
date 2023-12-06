const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('utilizador').value;
        const requestUserId = interaction.member.id; // TEST
        const requestUser = await interaction.guild.members.fetch(requestUserId); // TEST
        const reason = interaction.options.get('motivo')?.value || `${requestUser} não quis dizer a gente 😔`; // TEST

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("Utilizador inválido.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("Não podes kickar o reizão, burro de merda :KalliOK:");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Cargo mais alto do utilizador a ser kickado
        const requestUserRolePosition = interaction.member.roles.highest.position; // Cargo mais alto do utilizador que está a executar o comando
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Cargo mais alto do bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Não podes kickar este utilizador porque tens um cargo igual/menor que o dele(a).");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Não podes kickar este utilizador porque tem um cargo igual/maior que o bot.");
            return;
        }

        // Kicka o utilizador
        try {
            await targetUser.kick(reason);
            await interaction.editReply(`${targetUser} levou uma quicada <:sus:1053858585781739540>\nMotivo: ${reason}`);
        } catch (error) {
            console.log(`There was an error when banning: ${error}`);
        }
    },

    deleted: false,
    name: 'kick',
    description: '(ADM ONLY) Quica em alguém 😳',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'utilizador',
            description: 'Utilizador a ser kickado.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'motivo',
            description: 'Motivo do kick (opcional).',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
};