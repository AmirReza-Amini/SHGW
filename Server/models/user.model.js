const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  accessLevel: { type: mongoose.Schema.Types.ObjectId, ref: 'groupAccessLevels' },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  nationalID: { type: String, required: true, trim: true, minlength: 10, maxlength: 10 },
  fatherName: { type: String, required: true, trim: true },
  birthDate: { type: String, required: true },
  birthPlace: { type: String, required: true },
  gender: { type: String, required: true, enum: ['مرد', 'زن', 'سایر'] },
  // marry: { type: String, required: true, enum: ['مجرد', 'متاهل'] },
  contactInfo: { type: {} }, //Phone, Mobile, Address
  logins: { type: [Date] },
  registerDate: { type: String, default: new Date() },
  active: { type: Boolean, required: true, default: false },
  isDeleted: { type: Boolean, required: true, default: false }
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
