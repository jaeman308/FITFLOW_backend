const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ({
    text: {
    type: String,
    maxlength: 250,
    required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});


const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;