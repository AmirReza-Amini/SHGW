const mongoose = require('mongoose');

const commonSchema = new mongoose.Schema({
    type: { type: String, required: true }, //group-name, access-name, rule-name
    name: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false }
});

const commonModel = mongoose.model('common', commonSchema);
module.exports = commonModel;
