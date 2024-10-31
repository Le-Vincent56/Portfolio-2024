// Imports
const url = require('url');
const query = require('querystring');
const models = require('../models');
const { Code } = models;

const getCodeProjects = async (req, res) => 
{
    try {
        const docs = await Code.find({}).select('title roles imageURL id').lean().exec();
        
        return res.json({projects: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving code projects!'});
    }
};

const getCodePage = async (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    try {
        return res.status(200).json({ redirect: `/codeProject?title=${params.title}&id=${params.id}`});
    } catch (err) {
        return res.status(500).json({ error: 'Page not found '});
    }
}

const loadCodePage = (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    let postQuery = decodeURIComponent(params.title);
    return res.render('codeProject', { title: postQuery.toUpperCase(), id: params.id});
}

const getCodeProject = async (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    try {
        const docs = await Code.find({id: params.id}).lean().exec();
        return res.json({project: docs[0]});
    } catch (err) {
        return res.status(500).json({ error: 'Error retrieving code project! '});
    }
}

module.exports = {
    getCodeProjects,
    getCodePage,
    loadCodePage,
    getCodeProject,
};