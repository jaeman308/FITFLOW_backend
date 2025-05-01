const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token.js');
const Post = require('../models/post.js');
const Notification = require('../models/notification.js');
const Comment = require('../models/comment.js')
const mongoose = require('mongoose');

router.use(verifyToken);


router.post('/like/:postId', async (req, res) => {
    try{
        const userId = req.user._id;
        const post = await Post.findById(req.params.postId);

        if(!post) {
            return res.status(400).json({ message: "Post not found"});
        }

        if(post.likes.includes(userId)) {
            return res.status(400).json({ message: " You already liked this post"});
        };
        post.likes.push(userId);
        await post.save();
        
        if (post.author.toString() !== userId.toString()) {
            const notification = new Notification({
                user: post.author,
                type: 'like',
                post: post._id,
                sender: userId

            });
            await notification.save();
        }
        res.status(200).json({message: 'Post liked and notification sent'})


    }catch (err) {
        res.status(500).json({ message: err.message })

    }

});

router.post('/comment/:postId', async (req, res) => {
    try{

        const { text }= req.body;
        const postId = req.params.postId;
        const comment = await Comment.create({
            text,
            post: postId,
            author: req.user._id
        });
        
        await Post.findByIdAndUpdate(postId, {
            $push: {comment: comment._id}
        });

        const post = await Post.findById(postId);
        if(post.author.toString() !== req.user._id.toString()){
            await Notification.create({
                user: post.author,
                type: 'comment',
                post: postId,
                comment: comment._id,
                sender: req.user._id
            });
        }

        res.status(201).json(comment);

    }catch(err) {
        res.status(500).json({message: err.message});
    }


});

module.exports = router;