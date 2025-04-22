const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const CalorieTracker = require('../models/calorietracker.js');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose'); // for ObjectId casting

// ================== Protected Routes ====================
router.use(verifyToken);

router.post('/', async (req, res) => {
    console.log("POST / - user from token:", req.user);

    try {
        const tracker = new CalorieTracker({
            date: req.body.date,
            calorie_intake_goal: req.body.calorie_intake_goal,
            user: new mongoose.Types.ObjectId(req.user._id) // ensure valid ObjectId
        });

        await tracker.save();
        console.log("Tracker saved:", tracker);
        res.status(201).json(tracker);
    } catch (err) {
        console.error("Error saving tracker:", err);
        res.status(400).json({ error: err.message }); 
    }
});


router.get('/', async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id); // ✅ explicit cast

        console.log("User ID (casted):", userId);

        const entries = await CalorieTracker.find({ user: userId }).sort({ date: -1 });

        console.log("Found entries:", entries);

        if (entries.length === 0) {
            return res.status(200).json({ message: "No entries found for this user" });
        }

        const grouped = entries.reduce((acc, entry) => {
            const dateKey = moment(entry.date).format('YYYY-MM-DD');
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(entry);
            return acc;
        }, {});

        res.json(grouped);
    } catch (err) {
        console.error("Error fetching trackers:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:calorietrackerId', async (req, res) => {
    try {
        const tracker = await CalorieTracker.findById(req.params.calorietrackerId);
        if (!tracker) return res.status(404).json({ message: "Entry not found" });

        if (!tracker.user.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.json(tracker);
    } catch (error) {
        console.error("Error getting tracker:", error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/:calorietrackerId', async (req, res) => {
    try {
        const tracker = await CalorieTracker.findById(req.params.calorietrackerId);
        if (!tracker) return res.status(404).json({ message: "Entry not found" });

        if (!tracker.user.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const fields = ['calorie_burned', 'calorie_consumed', 'calorie_intake_goal', 'notes'];
        fields.forEach(field => {
            if (req.body[field] !== undefined) tracker[field] = req.body[field];
        });

        await tracker.save();
        res.json(tracker);
    } catch (error) {
        console.error("Error updating tracker:", error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:calorietrackerId', async (req, res) => {
    try {
        const tracker = await CalorieTracker.findById(req.params.calorietrackerId);
        if (!tracker) return res.status(404).json({ message: "Entry not found" });

        if (!tracker.user.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await tracker.deleteOne();
        res.json({ message: "Entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting tracker:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
