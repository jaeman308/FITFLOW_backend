const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: { type: String, unique: true },
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });


const Community = mongoose.model("Community",communitySchema )
module.exports = Community;