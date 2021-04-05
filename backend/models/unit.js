const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
    code: {type: String, required: true},
    title: {type: String},
    director: {type: String},
    staffs: {type: Array},
    students: {type: Array}
},{
    timestamps: true
});

module.exports = mongoose.model("Unit",unitSchema);