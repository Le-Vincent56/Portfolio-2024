// Imports
const mongoose = require('mongoose');

// Define the Code schema
const CodeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    roles: {
        type: [String],
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    sections: {
        type: Map,
        required: true,
    },
    imageURL: {
        type: String,
        trim: true
    },
    downloadURL: {
        type: String,
    },
    id: {
        type: Number,
        required: true,
    },
});

CodeSchema.statics.toAPI = (doc) => ({
    title: doc.title,
    roles: doc.roles,
    genre: doc.genre,
    sections: doc.sections,
    imageURL: doc.imageURL,
    downloadURL: doc.downloadURL,
    id: doc.id,
});

// Establish the Code model
const CodeModel = mongoose.model('Code', CodeSchema);

// Exports
module.exports = CodeModel;