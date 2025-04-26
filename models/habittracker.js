const mongoose = require('mongoose');

const habitTrackerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },

    description: {
        type: String,
        required: true,
        maxlength: 225
    },
    
    frequency: {
        type: String, 
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
    },
    
    checkmarks: [{
        type: Date
    }],

    order: {
        type: Number,
        default: 0
    },

    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
}, {timestamps: true});

const HabitTracker = mongoose.model("HabitTracker", habitTrackerSchema);

module.exports = HabitTracker ;