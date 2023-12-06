module.exports = {
    deleted: false,
    name: 'ping',
    description: 'Mostra o ping do utilizador, acho eu',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,

    callback: (client, interaction) => {
        interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
    },
};