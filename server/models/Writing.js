// Imports
const mongoose = require('mongoose');

// Define the Writing schema
const WritingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    genres: {
        type: [String],
        required: true,
    },
    imageURL: {
        type: String,
        trim: true
    },
    id: {
        type: Number,
        required: true,
    },
});

WritingSchema.statics.toAPI = (doc) => ({
    title: doc.title,
    genre: doc.genre,
    imageURL: doc.imageURL,
    id: doc.id,
});

// Establish the Code model
const WritingModel = mongoose.model('Writing', WritingSchema);

// Exports
module.exports = WritingModel;