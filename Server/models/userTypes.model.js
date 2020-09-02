const mongoose = require('mongoose');

const userTypeSchema = new mongoose.Schema({
    code: { type: Number, required: true },
    name: { type: String, required: true }
});

const userTypeModel = mongoose.model('userTypes', userTypeSchema);
module.exports = userTypeModel;
