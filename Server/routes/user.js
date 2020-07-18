const express = require('express');
const md5 = require('md5');
const router = express.Router();
const User = require('../models/user.model');
const { GetAll, Insert, Update, GetOne, Delete, } = require('../util/genericMethods');

router.route('/')
  .get(async (req, res) => {
    await GetAll(User, req, res,
      opt = {
        populate: "accessLevel"
      })
  })
  .post(async (req, res) => {
    if (req.body.option)
      await GetAll(User, req, res, req.body.option)

    else {
      req.body.password = md5(req.body.password).toUpperCase();
      req.body.nationalID = req.body.nationalID.toString().padStart(10, '0');

      await Insert(User, req, res);
    }
  })
  .put(async (req, res) => { await Update(User, req, res) })

router.route('/:id')
  .get(async (req, res) => {
    await GetOne(User, req, res,
      opt = {
        populate: "accessLevel"
      })
  })
  .put(async (req, res) => { await Update(User, req, res) })
  .get(async (req, res) => {
    await GetOne(User, req, res,
      opt = {
        populate: "accessLevel"
      })
  })
  .delete(async (req, res) => { await Delete(User, req, res) })

module.exports = router;
