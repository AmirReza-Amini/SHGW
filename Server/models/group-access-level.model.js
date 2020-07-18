const mongoose = require('mongoose');


const groupAlSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    rules: { type: {}, required: true },
    isDeleted: { type: Boolean, required: true, default: false }
});

const groupAlModel = mongoose.model('groupAccessLevels', groupAlSchema);
module.exports = groupAlModel;
