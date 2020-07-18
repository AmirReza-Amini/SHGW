const express = require('express');
const router = express.Router();
const GroupAccessLevel = require('../models/group-access-level.model');
const User = require('../models/user.model');
const { SendResponse } = require('../util/utility');

const { GetAll, Update, Insert } = require('../util/genericMethods');

router.route('/')
  .get(async (req, res) => {
    await GetAll(GroupAccessLevel, req, res,
      opt = {
        populate: "accessLevel"
      })
  })
  .post(async (req, res) => {
    await Insert(GroupAccessLevel, req, res);
  })
  .put(async (req, res) => {
    await Update(GroupAccessLevel, req, res);
  });

router.route('/:id')
  .delete(async (req, res) => {
    try {
      let defaultAl = await GroupAccessLevel.findOne({ title: 'Default-Access' });
      await User.updateMany({ accessLevel: req.params.id }, { accessLevel: defaultAl._id });
      let deletedata = await GroupAccessLevel.findByIdAndRemove(req.params.id);
      SendResponse(req, res, deletedata);
    }
    catch{
      SendResponse(res, res, { error: 'nothing found!' }, false, 404);
    }

  })

module.exports = router;