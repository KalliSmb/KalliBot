const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('utilizador').value;
        const duration = interaction.options.get('duracao').value;
        const requestUserId = interaction.member.id;
        const requestUser = await interaction.guild.members.fetch(requestUserId);
        const reason = interaction.options.get('motivo')?.value || `${requestUser} não quis dizer a gente 😔`;

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            await interaction.editReply("Utilizador inválido.");
            return;
        }

        if (targetUser.user.bot) {
            await interaction.editReply("Tás a tentar dar timeout num bot? <:OMEGALUL:715527251889881099>");
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply("Mete uma duração válida, burro do crl")
        }

        if (msDuration < 5000 || msDuration > 604800000) {
            await interaction.editReply("O timeout não pode ser menor que 5 segundos ou mais de 1 semana.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Cargo mais alto do utilizador a ser banido
        const requestUserRolePosition = interaction.member.roles.highest.position; // Cargo mais alto do utilizador que está a executar o comando
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Cargo mais alto do bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("Não podes dar timeout à este utilizador porque tens um cargo igual/menor que o dele(a).");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("Não podes executar este comando porque este utilizador tem um cargo igual/maior que o bot.");
            return;
        }

        // Dá timeout ao utilizador
        try {
            const { default: prettyMs } = await import('pretty-ms');

            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`O timeout do utilizador ${targetUser} foi atualizado para ${prettyMs(msDuration, { verbose: false })}.\nMotivo: ${reason}`);
                return;
            }

            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`O utilizador ${targetUser} levou um timeout de ${prettyMs(msDuration, { verbose: false })}.\nMotivo: ${reason}`);

        } catch (error) {
            console.log(`There was an error when timing out: ${error}`);
        }
    },

    name: 'timeout',
    description: '(ADM ONLY) Mete um gajo calado por um tempo',
    options: [
        {
            name: 'utilizador',
            description: 'Utilizador a levar timeout.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'duracao',
            description: 'Duração do timeout (5s, 30m, 1h, 7d).',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'motivo',
            description: 'Motivo do timeout (opcional).',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
}