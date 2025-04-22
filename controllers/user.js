const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const SALT_LENGTH = 12; 

router.post('/signup', async (req, res) => {
    try {
     const userInDatabase = await User.findOne({ username: req.body.username});
     if (userInDatabase) {
         return res.json({error: 'Username already taken.'});
     }
     const user = await User.create({
         username: req.body.username,
         email: req.body.email,
         hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH),
         firstName : req.body.firstName,
     })
     const token = jwt.sign({
        _id: user._id.toString(),  // <== this is key
        username: user.username
      }, process.env.JWT_SECRET);
     res.status(201).json({ user, token });
    } catch (error) {
     res.status(400).json({ error: error.message});
    }
  });
  
  
  router.post('/signin', async (req, res) => {
     try{
         const user = await User.findOne({ username: req.body.username });
         if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign({
                _id: user._id.toString(), 
                username: user.username
              }, process.env.JWT_SECRET);
             res. status(200).json({token});
         } else {
             res.status(401).json({error: 'Invalid username or password.'});
  
         }
     }catch (error){
         res.status(400).json({error: error.message});
  
     }
  });
  


module.exports = router; 