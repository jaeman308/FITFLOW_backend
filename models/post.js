const mongoose = require('mongoose');

const postSchema = new mongoose.Schema ({
    caption: {
        type: String,
        maxlength: 2200,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    media: [{
        type: String,
        required: true
    }],
    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        default: 0,
        ref: 'User'
    }],
    community: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Community'
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]

}, { timestamps: true});


const Post = mongoose.model("Post", postSchema);
module.exports = Post;
