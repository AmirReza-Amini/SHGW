const mongoose = require('mongoose');
const { db } = require('../app-setting')
const con = mongoose.createConnection(`mongodb://${db.mongo.log.address}/${db.mongo.log.name}`, { useNewUrlParser: true, useUnifiedTopology: true })

const logSchema = new mongoose.Schema({
  type: { type: String, required: true, lowercase: true, enum: ['error', 'warning', 'info', 'bcts'], default: 'info' },
  root: { type: String, required: true },
  message: { type: {} }, //{"title":"something...", "detail": "something..."}
  date: { type: Date, default: new Date() },
  read: { type: Boolean, default: false },
  req: { type: {} },
  res: { type: {} },
  client: { type: {} }
});

const logModel = con.model(`${new Date().toLocaleDateString().split('/').join('_')}`, logSchema);
module.exports = logModel;
