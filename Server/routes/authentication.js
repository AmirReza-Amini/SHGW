const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Setting = require('../models/setting.model');
const md5 = require('md5');
const { tokenHashKey, jwtSecret, jwtExpireTime } = require('../app-setting')
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const auth = require('../middleware/auth')
const { SendResponse, ConnectionString } = require('../util/utility')
const r = require('redis')
const redis = r.createClient();


router.post('/login', async (req, res) => {

  let cnnStr = (await Setting
    .findOne()
    .select(`cnnStrList.${req.body.area.toUpperCase()}`))
    .cnnStrList[req.body.area.toUpperCase()]

  if (!cnnStr)
    return await SendResponse(req, res, 'Invalid Area')
  let str = ConnectionString.Build(cnnStr);
  redis.set(req.body.username, str);
  let s = await ConnectionString.Get(req.body.username);

  SendResponse(req, res, s);

  // let doc = await User.findOne({
  //   username: req.body.username,
  //   password: md5(req.body.password).toUpperCase(),
  //   isDeleted: false
  // }).populate('accessLevel');
  // if (doc) {
  //   if (!doc.active)
  //     SendResponse(req, res, { error: 'اکانت مورد نظر غیر فعال می باشد' }, false);
  //   else {
  //     doc.logins.push(new Date());
  //     await doc.save();
  //     const token = jwt.sign({
  //       id: doc._id,
  //       lastName: doc.lastName,
  //       firstName: doc.firstName,
  //       accessLevel: doc.accessLevel,

  //       contactInfo: doc.contactInfo
  //     }, jwtSecret, { expiresIn: jwtExpireTime });

  //     SendResponse(req, res, { token: AES.encrypt(token, tokenHashKey).toString(), id: doc._id, tt: token });
  //   }
  // } else
  //   SendResponse(req, res, { error: 'کاربری با مشخصات وارد شده یافت نشد' }, false);
});
router.post('/login/verification', auth, async (req, res) => {
  let token = req.body.token;
  if (token) {
    const verify = jwt.verify(token, jwtSecret);
    SendResponse(req, res, { verify });
  }
});

router.put('/changePassword/:id',
  async (req, res) => {
    let doc = await User.findOne({
      _id: req.body._id,
      isDeleted: false
    }).populate('accessLevel');
    await Log({ root: 'User.js', message: { title: `Password Changed for ${req.body._id}` } })

    if (doc.password !== md5(req.body.oldPassword).toUpperCase()) {
      SendResponse(req, res, { error: 'رمز عبور فعلی صحیح نمیباشد' }, false)
    } else {
      doc.password = md5(req.body.password).toUpperCase()
      await doc.save();

      const token = jwt.sign({
        id: doc._id,
        lastName: doc.lastName,
        firstName: doc.firstName,
        accessLevel: doc.accessLevel,
        contactInfo: doc.contactInfo
      }, jwtSecret, { expiresIn: '30s' });
      SendResponse(req, res, { token: AES.encrypt(token, tokenHashKey).toString() });
    }
  })

module.exports = router;
