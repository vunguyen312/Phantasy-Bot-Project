const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { BattlePVE } = require('../../battle_system/battleInteract');
const { EmbedRow, waitForResponse, checkResponse } = require('../../utilities/embedUtils');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('dummy')
        .setDescription(`Spawn a combat dummy.`)
        .addStringOption(option =>
            option
            .setName("monster")
            .setDescription("Monster to use as a dummy")
            .setRequired(true)),
    syntax: '/dummy',
    conditions: ["0005"],
    async execute(interaction, profileData){

        const { battleStats, activeSpells } = profileData;
        const monster = interaction.options.getString('monster');
        const battle = new BattlePVE(interaction, interaction.user.tag, monster, battleStats, activeSpells);
        battle.startBattle();
    }
}