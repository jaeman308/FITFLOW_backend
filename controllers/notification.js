const express = require('express');
const verifyToken = require('../middleware/verify-token');
const router =  express.Router();
const Notification = require('../models/notification');
const mongoose = require('mongoose')


//===================== Protected Routes ============================
router.use(verifyToken);


router.post('/', async (req, res) => {
    try{
        const { type, post, comment, sender } = req.body;

        const notification = new Notification({
            user: req.body.user || req.user._id,
            type,
            post,
            comment,
            sender
        });
        await notification.save();
        
        res.status(201).json(notification)

    }catch (err) {
        res.status(500).json({ message: err.message })
    }

});

router.get('/', async (req,res) => {
    try{
        const notifications = await Notification.find({ user: req.user._id })
        .populate('sender', 'username')
        .populate('post', 'caption')
        .populate('comment', 'text')
        .sort({ createdAt: -1});

        res.json(notifications);

    }catch (err){
        res.status(500).json({ message: err.message })
    }
})

router.patch('/mark-read', async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;