const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Post = require('../models/post.js');
const router = express.Router();
const mongoose = require('mongoose');

router.use(verifyToken);

router.post('/',async (req, res) => {
    try{
        const NewPost = new Post({
            caption: req.body.caption,
            media : req.body.media,
            author: req.user._id
        })
        await NewPost.save();
        res.status(201).json(NewPost)

    }catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/',async (req, res) => {
    try{
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const ownerPost = await Post.find({ author: userId }).sort({ createdAt: -1 });

        if (ownerPost.length === 0){
            return res.status(200).json({ message: "Post now!"})
        }

        res.json(ownerPost)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.get('/:postId',async (req, res) => {
    try{ 
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found"});
        if (!post.author.equals(req.user._id)){
            return res.status(403).json({message: "Unauthorized"});
        }
        res.json(post);

    }catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.put('/:postId',async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Entry not found" });

        if (!post.author.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const fields = ['caption']
        fields.forEach(field => {
            if(req.body[field] !== undefined) post[field] = req.body[field];
        })

        await post.save()
        res.json(post);

    }catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.delete('/:postId',async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found"});
        if (!post.author.equals(req.user._id)){
            return res.status(403).json({message: "Unauthorized"});
        }

        await post.deleteOne()
        res.json({message: "Post deleted successfully"});

    }catch (err) {
        res.status(500).json({ message: err.message })
    }
});



module.exports = router;