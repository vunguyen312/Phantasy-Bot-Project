const profileModel = require('../models/profileSchema');
const clanModel = require('../models/clanSchema');
const objectModel = require('../models/objectSchema');

const createNewPlayer = async (interaction) => {
    const playerStats = {
        userID: interaction.user.id,
        rank: 'Lord',
        gold: 0,
        bank: 0,
        productionScore: 1,
        citizens: 1,
        growthRate: 1,
        earnRate: 10,
        taxRate: .1,
        jobs: new Map(),
        structures: new Map(),
        notifications: true,
        oath: 'Wanderer',
        inventory: new Map()
    }

    try{

        const newPlayer = await profileModel.create(playerStats);

        newPlayer.save();

        return newPlayer;

    } catch(error) {
        console.error(error);
    }
}

const modifyValue = async (model, query, operation) => {

    const models = {
        "profile": profileModel,
        "clan": clanModel,
        "object": objectModel
    };

    try{

        await models[model].findOneAndUpdate(query, operation);
        
    } catch (error) {
        console.error(error);
    }
}

const getObjectData = async (table) => {
    try{

        const dataTable = await objectModel.findOne({ identifier: table });
        
        return dataTable.data;

    } catch (error) {
        console.error(error);
    }
}

module.exports = {createNewPlayer, modifyValue, getObjectData}