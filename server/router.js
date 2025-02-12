// Imports
const controllers = require('./controllers');

// Route pages
const router = (app) => 
{
    app.get('/', controllers.Home.index);
    app.get('/getHome', controllers.Home.getHome);

    app.get('/getAudioProjects', controllers.Audio.getAudioProjects);
    app.get('/getCodeProjects', controllers.Code.getCodeProjects);
    app.get('/getWritingProjects', controllers.Writing.getWritingProjects);

    app.get('/getCodePage', controllers.Code.getCodePage);
    app.get('/codeProject', controllers.Code.loadCodePage);
    app.get('/getCodeProject', controllers.Code.getCodeProject);
}

module.exports = router;