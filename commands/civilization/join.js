const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const clanModel = require('../../models/clanSchema');
const profileModel = require('../../models/profileSchema');
const { modifyValue } = require('../../utilities/dbQuery');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a civilization!')
        .addStringOption(option =>
            option
            .setName('id')
            .setDescription('ID of the Server/Civilization'))
        .setDMPermission(false),
    conditions: [
        {check: (interaction, profileData) => profileData.allegiance, msg: `Hm... It appears you're already in a civilization.`},
    ],
    async execute(interaction, profileData){
        const clanData = await clanModel.findOne({ serverID: interaction.options.getString('id') }) || await clanModel.findOne({ serverID: interaction.guild.id });

        if(!clanData) return interaction.reply({ content: 'Invalid Civilization ID (Server ID)', ephemeral:true });
        if(clanData.public === false) return interaction.reply({ content: 'This civilization is private and invite only!'});
    

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`${interaction.user.tag} has joined ${clanData.clanName}!`)
        .setFields(
            { name: '💎 Rank:', value: '*Baron*'},
        )
        .setThumbnail(interaction.user.displayAvatarURL()); 

        await modifyValue(
            { userID: interaction.user.id },
            { allegiance: clanData.clanName, rank: 'Baron' }
        );

        await modifyValue(
            { serverID: interaction.options.getString('id') ?? interaction.guild.id },
            { $set: { [`members.Baron.${interaction.user.id}`]: interaction.user.id } }
        );

        await interaction.reply({ embeds: [embed] });
    }
}