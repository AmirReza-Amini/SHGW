const mongoose = require('mongoose');


const areaSchema = new mongoose.Schema({
  
  areaName: { type: String, required: true, trim: true },
  isActive: { type: Boolean, required: true, default: false },
  
});

const areaModel = mongoose.model('areas', areaSchema);
module.exports = areaModel;
