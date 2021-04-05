const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
   // postId: {type: Number, required: true},
   author: {type: String, required: true},
   body: {type: String, default: "", required: true},
   anonymous: {type: Boolean}
},{
    timestamps: true
});

module.exports = mongoose.model("Comment",commentSchema);