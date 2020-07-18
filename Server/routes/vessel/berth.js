const express = require('express');
const router = express.Router();
const Events = require('../../util/EventList')
const { GetAll, Insert, DeleteById } = require('../../util/GenericMethods');
const { SendResponse } = require('../../util/utility')

router.get('/load', async (req, res) => {
    console.log(Events);
    res.socket.emit(Events.LOAD, req.body);
    SendResponse(req, res, { capitan: 'Cntr loaded' })
})
router.get('/unload', async (req, res) => {
    res.socket.emit(Events.UNLOAD, req.body);
    SendResponse(req, res, { capitan: 'Cntr unloaded' })
})
router.get('/damage', async (req, res) => {
    res.socket.emit(Events.DAMAGE, req.body);
    SendResponse(req, res, { capitan: 'Damage(s) registered' })
})
module.exports = router;