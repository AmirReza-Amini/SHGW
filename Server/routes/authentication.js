const express = require('express');
const router = express.Router();
const Users = require('../models/users.model');
const Setting = require('../models/setting.model');
const md5 = require('md5');
const { tokenHashKey, jwtSecret, jwtExpireTime } = require('../app-setting')
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const auth = require('../middleware/auth')
const { SendResponse  ,GenerateAuthToken} = require('../util/utility')
const r = require('redis');
const { MD5 } = require('crypto-js');
const redis = r.createClient();


router.post('/', async (req, res) => {
  let user = await Users.findOne({
    userCode: req.body.username,
    password: md5(req.body.password),
    area:req.body.area
  })
  //console.log('from server ', md5(req.body.password))
  if (user) {
    if (!user.isActive)
      SendResponse(req, res,  'اکانت مورد نظر غیر فعال می باشد' , false,401);
    else {
      const token = GenerateAuthToken(user);
      //console.log('token',token); 
      SendResponse(req, res, { token: token});
    }
  } else
    SendResponse(req, res,  'کاربری با مشخصات وارد شده یافت نشد', false,401);
});
router.post('/login/verification', auth, async (req, res) => {
  let token = req.body.token;
  if (token) {
    const verify = jwt.verify(token, jwtSecret);
    SendResponse(req, res, { verify });
  }
});

module.exports = router;
