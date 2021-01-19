const express = require('express');
const md5 = require('md5');
const router = express.Router();
const { SendResponse } = require('../util/utility')
const Users = require('../models/users.model')
const Permission = require('../models/permissions.model')
const { GetAll, Update, HardDelete, InsertMany } = require('../util/genericMethods');
const auth = require('../middleware/auth');
const adminOrSuperuser = require('../middleware/adminOrSuperuser');
const queries = require('../util/T-SQL/queries');
const setting = require('../app-setting')
const sworm = require('sworm');
const db = sworm.db(setting.db.sqlConfig);


router.get('/getAllUsersFromBcts', async (req, res) => {
  try {
    var { permissions } = await Permission.findOne();
    var result = await db.query(queries.USER.getAllUsersFromBcts,{});
    //console.log('sa', result);
    if (result && result.length > 0) {

      let temp = result.map(item => {
        return {
          ...item,
          password: md5(item.password.trim()),
          permissions: permissions
        }
      });
      req.body = temp;
      await InsertMany(Users, req, res)
    }
    else {
      return SendResponse(req, res, 'call to administrator', false);
    }
  } 
  catch (error) {
    console.log(error)
    return SendResponse(req, res, error, false, 500);
  }
});

router.route('/')
  .get([auth, adminOrSuperuser], async (req, res) => {
    console.log('user', req.body)
    await GetAll(Users, req, res)
  })
  // .post([auth, admin],async (req, res) => {
  //   if (req.body.option)
  //     await GetAll(Users, req, res, req.body.option)
  //   else {
  //     req.body.password = md5(req.body.password).toUpperCase();
  //     await Insert(Users, req, res);
  //   }
  // })
  .put([auth, adminOrSuperuser], async (req, res) => {
    await Update(Users, req, res)
  })



router.route('/:id')
  .delete([auth, adminOrSuperuser], async (req, res) => {
    req.body._id = req.params.id;
    await HardDelete(Users, req, res)
  })

module.exports = router;
