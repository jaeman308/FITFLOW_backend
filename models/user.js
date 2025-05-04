const mongoose = require('mongoose');

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
    firstName: {
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    bio: {
        type: String,
        maxlength: 250,
    },
    avatar : {
        type: String, 
        required: true,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,

    }],
}, {timestamps: true});


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
})

const User = mongoose.model("User", userSchema)


module.exports = User;
   