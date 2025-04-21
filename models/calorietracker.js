const mongoose = require('mongoose');

const calorieTrackerSchema = new mongoose.Schema ({
    date: {
        type: Date,
        required: true
    },
    calorie_intake_goal:{
        type: Number,
        default: 0,
        required: true,
    },
    calorie_consumed: {
        type: Number,
        default: 0
    },
    calorie_burned: {
        type: Number,
        default: 0
    },
    notes: {
        type: String, 
        maxlength: 255
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

const CalorieTracker = mongoose.model("CalorieTracker", calorieTrackerSchema);

module.exports = CalorieTracker

