// Imports
const path = require('path');
const express = require('express');
const compression = require('compression');
//const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const router = require('./router.js');

// Connect to Mongoose
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/portfolio';

console.log(dbURI);

mongoose.connect(dbURI).catch((err) => 
{
    // Check for errors
    if (err)
    {
        console.log('Could not connect to database');
        throw err;
    }
});

// Get the port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Create the app 
const app = express(); // Use express
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`))); // Link assets folder
app.use(compression()); // Use compression
app.use(bodyParser.urlencoded({ extended: true })); // Parse form POST requests as urlencoded
app.use(bodyParser.json()); // Parse application/JSON body requests

// Setup the view (MVC) to use handlebars
app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: '',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
//app.use(favicon(`${__dirname}/../client/img/favicon.png`));

// Pass the app to the router
router(app);

// Listen on the port
app.listen(port, (err) => 
{
    if(err)
    {
        throw err;
    }

    console.log(`Listening on port ${port}`);
});