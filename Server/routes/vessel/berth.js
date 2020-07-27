const express = require('express');
const router = express.Router();
const Events = require('../../util/EventList')
const { SendResponse } = require('../../util/utility')
const queries = require('../../util/T-SQL/queries')
const setting = require('../../app-setting')
const sworm = require('sworm');
const db = sworm.db(setting.db.sqlConfig);

// router.get('/load', async (req, res) => {
//     console.log(Events);
//     res.socket.emit(Events.LOAD, req.body);
//     SendResponse(req, res, { capitan: 'Cntr loaded' })
// })
// router.get('/unload', async (req, res) => {
//     res.socket.emit(Events.UNLOAD, req.body);
//     SendResponse(req, res, { capitan: 'Cntr unloaded' })
// })
// router.get('/damage', async (req, res) => {
//     res.socket.emit(Events.DAMAGE, req.body);
//     SendResponse(req, res, { capitan: 'Damage(s) registered' })
// })

router.post('/getCntrInfoForUnload', async (req, res) => {

    console.log('result',req)
    var result = await db.query(queries.VESSEL.BERTH.getCntrInfoForUnload, { voyageId: req.body.voyageId,cntrNo:req.body.cntrNo });
    console.log('result',result)

    SendResponse(req, res, result, (result && result.length > 0))
})

module.exports = router;