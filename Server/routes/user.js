const express = require('express');
const md5 = require('md5');
const router = express.Router();
const Users = require('../models/users.model')
const { GetAll, Insert, Update, GetOne, Delete, HardDelete, } = require('../util/genericMethods');
const auth = require('../middleware/auth');
const adminOrSuperuser = require('../middleware/adminOrSuperuser');

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
  .put([auth, adminOrSuperuser], async (req, res) => { await Update(Users, req, res) })

router.route('/:id')
  .delete([auth, adminOrSuperuser], async (req, res) => {
    req.body._id = req.params.id;
    await HardDelete(Users, req, res)
  })

module.exports = router;
