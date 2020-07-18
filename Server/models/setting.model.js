const mongoose = require('mongoose');


const settingSchema = new mongoose.Schema({
    cnnStrList: { type: {} }
});

const settingModel = mongoose.model('settings', settingSchema);
module.exports = settingModel;
