const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const GoalLog = require('../models/goal.js');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');

// ================== Protected Routes ====================
router.use(verifyToken);

router.post("/", async (req, res) => {
       try {
            const log = new GoalLog({
                title : req.body.title,
                description : req.body.description,
                length: req.body.length,
                start_date: req.body.start_date,
                finish_date: req.body.finish_date,
                user: new mongoose.Types.ObjectId(req.user._id)
            });
    
            await log.save();
            console.log("Log saved:", log);
            res.status(201).json(log);
        } catch (err) {
            console.error("Error saving goal log:", err);
            res.status(400).json({ error: err.message }); 
        }

});

router.get('/',  async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const entries = await GoalLog.find({ user: userId }).sort({ start_date:-1 });
        if (entries.length === 0) {
            return res.status(200).json({ message: "No entries found for this user"});
        }
        const allGoalLogs = entries.reduce((acc, entry) => {
            const dateKey = moment(entry.start_date).format("YYYY-MM-DD");
            if(!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(entry);
            return acc;
        },{});
        res.json(allGoalLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:goallogId', async (req,res)=> {
    try {
        const log = await GoalLog.findById(req.params.goallogId);
        if(!log) return res.status(404).json({ message: "Entry not found"});

        if(!log.user.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        res.json(log);
    }catch (err){
        res.status(500).json({ message: err.message });
    };

});
router.put('/:goallogId', async (req,res) =>{
    try {
        const log = await GoalLog.findById(req.params.goallogId);
        if(!log) return res.status(400).json({ message: "Entry not found"});

        if(!log.user.equals(req.user._id)){
            return res.status(403).json({message: "Unauthorized"});
        }
        const fields = ["progress", "notes", "finish_date"];
        fields.forEach(field => {
            if(req.body[field] !== undefined) log[field] = req.body[field];
        });
        await log.save();
        res.json(log);
    }catch(err) {
        res.status(500).json({ messge: err.message });
    }
});

router.delete('/:goallogId', async (req,res) =>{
    try {
    const log = await GoalLog.findById(req.params.goallogId);
    if(!log) return res.status(400).json({ message: "Entry not found"});

     if(!log.user.equals(req.user._id)){
        return res.status(403).json({message: "Unauthorized"});
    }
    await log.deleteOne();
    res.json({message: "Entry delete successfully"});

    } catch(err) {
        res.status(500).json({ message: err.message });
    }

});

module.exports = router;