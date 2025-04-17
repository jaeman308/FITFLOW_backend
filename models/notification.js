const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["like", "comment"],
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date, 
        default: Date.now
    }
});

const Notification = mongoose.model("Notification", notificationSchema);
module.export = Notification;