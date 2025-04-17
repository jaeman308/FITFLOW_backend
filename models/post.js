const mongoose = require('mongoose');

const postSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: 40,
        required: true
    },
    author: {
        type: ObjectId,
        ref:"User",
        required: true
    },
    likes : {
        type: Number,
        default: 0
    },
    likedBy :{
        type: ObjectId,
        ref: "User"
    },
    comment: {
        type: ObjectId,
        ref: "Comment"
    }

});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;