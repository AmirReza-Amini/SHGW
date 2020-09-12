const mongoose = require('mongoose');
const { tokenHashKey, jwtSecret, jwtExpireTime } = require('../app-setting')
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, trim: true },
  userCode: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  isActive: { type: Boolean, required: true, default: false },
  password: { type: String, required: true, trim: true },
  userType: { type: String, required: true, trim: true },
  permissions: { type: [] }
});


//   userSchema.methods.generateAuthToken = function () {

//   const token = jwt.sign({
//     id: this._id,
//     lastName: this.lastName,
//     firstName: this.firstName,
//     permissions: this.permissions,
//     area:this.area,
//     userType: this.userType
//   }, jwtSecret, { expiresIn: jwtExpireTime });

//   const tokenCrypted = AES.encrypt(
//     token,
//     tokenHashKey
//   ).toString();

//   return tokenCrypted;
// };

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;

