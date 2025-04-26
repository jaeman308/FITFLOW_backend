const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const HabitTracker = require('../models/habittracker.js');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');

router.use(verifyToken);

 router.post("/", async (req, res) => {
     try{ 
         const newHabit = new HabitTracker({
             title: req.body.title,
             description: req.body.description,
             frequency: req.body.frequency,
             user: new mongoose.Types.ObjectId(req.user._id)
        });
        await newHabit.save();
        res.status(201).json(newHabit);
     }catch(err) {
        res.status(400).json({ error: err.message })
     }

 });

 router.get("/", async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const habitEntries = await  HabitTracker.find({ user: userId}).sort({ order: 1, createdAt: 1 })

        if (habitEntries.length === 0) {
            return res.status(200).json({message: "No entries found for this user"});
        }
        res.json(habitEntries);

    }catch (err) {
        res.status(500).json({error: err.message });
    }

 });

 router.get("/:habittrackerId", async (req, res) => {
    try{
        const habitTracker = await HabitTracker.findById(req.params.habittrackerId);
        if(!habitTracker) return res.status(400).json({message: "Entry not found"});

        if(!habitTracker.user.equals(req.user._id)){
            return res.status(403).json({ meassage:  "Unauthorized" });
        }
        res.json(habitTracker);

    }catch(err) {
        res.status(500).json({ message: err.message })
    }
 })

 router.put("/:habittrackerId", async (req, res) => {
    try {
        const habitTracker = await HabitTracker.findById(req.params.habittrackerId);
        if(!habitTracker) return res.status(400).json({message: "Entry not found"});

        if(!habitTracker.user.equals(req.user._id)){
            return res.status(403).json({ message:  "Unauthorized" });
        }

        if (req.body.checkmark) {
            const checkmarkDate = new Date(req.body.checkmark);
            habitTracker.checkmarks.push(checkmarkDate);
            habitTracker.lastCheckedAt = checkmarkDate;
        }
        if (req.body.order !== undefined) {
            habitTracker.order= req.body.orderl
        }

        await habitTracker.save()
        res.json(habitTracker)

    }catch (err) {
        res.status(500).json({ message: err.message });

    }

 });

 router.delete("/:habittrackerId", async (req, res) => {
    try {
        const habitTracker = await HabitTracker.findById(req.params.habittrackerId);
        if (!habitTracker) return res.status(404).json({message: "Habit not found"});

        if (!habitTracker.user.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await habitTracker.deleteOne();
        res.json({ message: "Entry deleted successfully" });

    }catch(err) {
        res.status(500).json({message: err.message})
    }

 });

module.exports = router;
