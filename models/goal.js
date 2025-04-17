const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String, 
        required: true, 
        maxlength: 255
    },
    length: {
        type: String,
        enum: ['week', 'month', 'year'],
        required: true
    },
    progress: {
        type: Number,
        min: 0, 
        default: 0
    },
    start_date: {
        type: Date, 
        required: true
    },
    finish_date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
})


const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;


