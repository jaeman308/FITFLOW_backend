const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String, 
        required: true, 
        maxlength: 255
    },
    length: {
        type: String,
        enum: ['week', 'month', 'year'],
        required: true
    },
    progress: {
        type: Number,
        min: 0, 
        default: 0
    },
    start_date: {
        type: Date, 
        required: true
    },
    finish_date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
})

const habitTrackerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 225
    },
    frequency: {
        type: String, 
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
});

const calorieTrackerSchema = new mongoose.Schema ({
    date: {
        type: Date,
        required: true
    },
    calorie_intake_goal:{
        type: Number,
        default: 0
    },
    calorie_consumed: {
        type: Number,
        default: 0
    },
    calorie_burned: {
        type: Number,
        default: 0
    },
    notes: {
        type: String, 
        maxlength: 255
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});


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

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true

    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    }
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
})

const User = mongoose.model("User", userSchema)''
const Goal = mongoose.model("Goal", goalSchema);
const HabitTracker = mongoose.model("HabitTracker", habitTrackerSchema);
const CalorieTracker = mongoose.model("CalorieTracker", calorieTrackerSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exoprts ={
    User,
    Goal,
    HabitTracker,
    CalorieTracker,
    Notification,
    Post,
    Comment
};