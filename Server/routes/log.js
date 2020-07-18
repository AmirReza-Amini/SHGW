const express = require('express');
const router = express.Router();
const Log = require('../models/log.model');
const Events = require('../util/EventList')
const { GetAll, Insert, DeleteById } = require('../util/GenericMethods');

router.route('/:id?')
  .get(async (req, res) => await GetAll(Log, req, res))
  .post(async (req, res) => {
    res.socket.emit(Events.DATA_ADDED, req.body);
    await Insert(Log, req, res);
  })
  .delete(async (req, res) => await DeleteById(Log, req, res));

module.exports = router;
