// Imports
const url = require('url');
const query = require('querystring');
const models = require('../models');
const { Writing } = models;

const getWritingProjects = async (req, res) => 
{
    try {
        const docs = await Writing.find({}).select('title genres imageURL id').lean().exec();
        
        return res.json({projects: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving code projects!'});
    }
};

module.exports = {
    getWritingProjects,
};