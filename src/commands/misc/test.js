module.exports = {
    deleted: false,
    name: 'test',
    description: '(DEV ONLY)',
    devOnly: true,
    // testOnly: Boolean,
    // options: Object[],

    callback: (client, interaction) => {
        interaction.reply("<:OMEGALUL:715527251889881099>"); // nome emote + id emote
    },
};