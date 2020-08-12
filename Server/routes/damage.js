const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const db = sworm.db(setting.db.sqlConfig);

router.get('/fetchDamageDefinition', async (req, res) => {

    //console.log('result',req)
    var result = await db.query(queries.DAMAGE.fetchDamageDefinition);
    //console.log('result',result)
    // res.socket.emit(Events.LAST_VOYAGES_LOADED, result);

    SendResponse(req, res, result, (result && result.length > 0))
})



router.post('/getDamageInfoByActId', async (req, res) => {

    let actId = req.body.actId || 0;
    //console.log('result',req,actId)
    var result = await db.query(queries.DAMAGE.getDamageInfoByActId, { actId: actId });
    //console.log('getDamageInfoByActId',result)
    // res.socket.emit(Events.LAST_VOYAGES_LOADED, result);

    SendResponse(req, res, result, (result && result.length > 0))
})

router.post('/setDamageInfoByActId', async (req, res) => {

    //let actId = req.body.actId || 0;
    console.log('result',req.body)
    const { actId, letters, side, staffId } = req.body;
    var result = await db.query(queries.DAMAGE.setDamageInfoByActId, { actId: actId, text: letters, side: side, staffId: staffId });
    console.log('setDamageInfoByActId',result)
    // res.socket.emit(Events.LAST_VOYAGES_LOADED, result);

    let message = result[0]["Result"] =='1' ? "خسارت کانتینر ثبت شد":'خطا در ثبت خسارت کانتینر';
    SendResponse(req, res, message, result[0]["Result"] =='1');
})
module.exports = router;