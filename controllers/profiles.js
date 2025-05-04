const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token.js');
const User = require('../models/user.js')
const upload = require('../middleware/upload.js')
const mongoose = require('mongoose');

router.use(verifyToken);

router.get('/me', verifyToken, async (req, res) =>{
    try{
        const  user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('username bio avatar');
        if(!user) return res.status(404).json({message: 'User not found'});
        res.json(user);

    } catch (err) {
        res. status(500).json({ message: err.message})
    }
});

router.patch('/',upload.single('avatar'), async (req, res) => {
    try{
        const updates = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id, updates, 
            { avatar: req.file.path },
            { new: true});
        res.json(user);
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
});