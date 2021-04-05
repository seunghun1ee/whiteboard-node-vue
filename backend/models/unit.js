const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
    code: {type: String, required: true},
    title: {type: String, required: true},
    director: {type: String, required: true},
    staffs: {type: Array, default: []},
    students: {type: Array, default: []}
});

module.exports = mongoose.model("Unit",unitSchema);