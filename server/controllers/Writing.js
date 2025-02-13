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

const getWritingProject = async (req,res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);
    
    try {
        const docs = await Writing.find({id: params.id}).lean().exec();
        return res.json({project: docs[0]});
    } catch (err) {
        return res.status(500).json({ error: 'Error retrieving code project! '});
    }
}

module.exports = {
    getWritingProjects,
    getWritingProject
};