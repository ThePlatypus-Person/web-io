const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a competition name'],
        maxlength: 30
    },
    img: {
        type: String,
        required: [true, 'Please provide the image path']
    },
    path: {
        type: String,
        required: [true, 'Please provide the competition link path']
    },
    desc: {
        type: String,
        required: [true, 'Please provide a description']
    },
    participants: {
        type: [String],
        default: []
    },
});

module.exports = mongoose.model('Competition', CompetitionSchema);
