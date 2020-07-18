const express = require('express');
const router = express.Router();
const Log = require('../../models/log.model');
const { Events } = require('../../util/EventList')
const { GetAll, Insert, DeleteById } = require('../../util/GenericMethods');
const { SendResponse } = require('../../util/utility')


router.route('/')
    .get(async (req, res) => {
       SendResponse(req,res,{res:'Hello from Vessel'})
    })

module.exports = router;