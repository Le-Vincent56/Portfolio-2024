// Imports
const models = require('../models');
const { Audio } = models;

const getAudioProjects = async (req, res) => 
{
    try 
    {
        const docs = await Audio.find({}).select('title trackURL imageURL id').lean().exec();
        return res.json({projects: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving audio projects!'});
    }
};

module.exports = {
    getAudioProjects
};
