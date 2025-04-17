const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ({
    text: {
    type: String,
    maxlength: 250,
    required: true
    },
    author: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: ObjectId,
        ref: "User"
    }

});


const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;