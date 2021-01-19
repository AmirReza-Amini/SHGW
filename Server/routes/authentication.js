const express = require('express');
const router = express.Router();
const Users = require('../models/users.model');
const md5 = require('md5');
const { SendResponse, GenerateAuthToken } = require('../util/utility')


router.post('/', async (req, res) => {
  let user = await Users.findOne({
    userCode: req.body.username,
    password: md5(req.body.password),
    area: req.body.area
  })
  
  //console.log('from server ', md5(req.body.password))
  if (user) {
    if (!user.isActive)
      return SendResponse(req, res, "The user account is inactive", false, 200);
    else {
      const token = GenerateAuthToken(user);
      //console.log('token',token); 
      return SendResponse(req, res, { token: token });
    }
  } else
  return SendResponse(req, res, "User not found", false, 401);
});

module.exports = router;
