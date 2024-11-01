// Imports
const mongoose = require('mongoose');

// Define the Audio schema
const AudioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    trackURL: {
        type: String,
        required: true,
        trim: true
    },
    imageURL: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: Number,
        required: true,
    }
});

AudioSchema.statics.toAPI = (doc) => ({
    title: doc.title,
    imageURL: doc.imageURL,
    trackURL: doc.trackURL,
    id: doc.id
});

// Establish the Audio model
const AudioModel = mongoose.model('Audio', AudioSchema);

// Exports
module.exports = AudioModel;
