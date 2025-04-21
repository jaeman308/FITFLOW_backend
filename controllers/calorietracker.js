const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const CalorieTracker = require('../models/calorietracker.js');
const router = express.Router();

// ================== Protected Routes ====================
router.use(verifyToken);

router.post('/', async (req, res) => {
    console.log("user from token:", req.user);
    try {
        const tracker = new CalorieTracker({
            date: req.body.date,
            calorie_intake_goal: req.body.calorie_intake_goal,
            user: req.user._id 
        });
        await tracker.save();
        res.status(201).json(tracker);
    } catch (err) {
        res.status(400).json({ error: err.message }); 
    }
});


router.get('/', async (req, res) => {
    try {
        const entries = await CalorieTracker.find({ user: req.user.id }).sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:calorietrackerId', async (req, res) => {
    try {
        const tracker = await CalorieTracker.findById(req.params.calorietrackerId);
        if (!tracker) return res.status(404).json({ message: "Entry not found" });
        if (!tracker.user.equals(req.user.id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        res.json(tracker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:calorietrackerId', async (req, res) => {
    try {
        const tracker = await CalorieTracker.findById(req.params.calorietrackerId);
        if (!tracker) return res.status(404).json({ message: "Entry not found" });
        if (!tracker.user.equals(req.user.id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if (req.body.calorie_burned !== undefined) tracker.calorie_burned = req.body.calorie_burned;
        if (req.body.calorie_consumed !== undefined) tracker.calorie_consumed = req.body.calorie_consumed;
        if (req.body.calorie_intake_goal !== undefined) tracker.calorie_intake_goal = req.body.calorie_intake_goal;
        if (req.body.notes !== undefined) tracker.notes = req.body.notes;
        await tracker.save();
        res.json(tracker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:calorietrackerId', async (req, res) => {
    try {
        const tracker = await CalorieTracker.findById(req.params.calorietrackerId);
        if (!tracker) {
            return res.status(404).json({ message: "Entry not found" });
        }
        if (!tracker.user.equals(req.user.id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        await tracker.deleteOne();
        res.json({ message: "Entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
