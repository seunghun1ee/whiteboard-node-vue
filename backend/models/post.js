const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    unitId: {type: mongoose.ObjectId, required: true},
    title: {type: String, required: true},
    author: {type: String, required: true},
    tags: {type: Array, default: []},
    body: {type: String, default: "", required: true},
    anonymous: {type: Boolean, default: false},
    comments: {type: Array, default: []},
    answered: {type: Boolean, default: false}
},{
    timestamps: true
});

module.exports = mongoose.model("Post", postSchema);