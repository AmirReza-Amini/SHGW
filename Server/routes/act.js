const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const db = sworm.db(setting.db.sqlConfig);


router.post('/isPossibleSaveAct', async (req, res) => {

    const { cntrNo, nextActType } = req.body;
    var result = await db.query(queries.ACT.isPossibleSaveAct, { cntrNo: cntrNo, nextActType: nextActType });
    let message = result[0]["Result"] =='1' ? "توالی عملیات رعایت شده":"توالی عملیات رعایت نشده";
    SendResponse(req, res, message, result[0]["Result"] =='1');
})
module.exports = router;