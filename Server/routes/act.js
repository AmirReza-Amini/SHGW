const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const auth = require('../middleware/auth');
const db = sworm.db(setting.db.sqlConfig);


router.post('/isPossibleSaveAct', auth, async (req, res) => {

    if (!req.body.cntrNo || !req.body.nextActType)
        return SendResponse(req, res, "Input data is not valid", false, 400);
    const { cntrNo, nextActType } = req.body;
    try {
        var result = await db.query(queries.ACT.isPossibleSaveAct, { cntrNo: cntrNo, nextActType: nextActType });
        let message = result[0]["Result"] == '1' ? "The sequence of operation is right" : "The sequence of operation is not right"
        SendResponse(req, res, message, result[0]["Result"] == '1');
    } catch (error) {
        return SendResponse(req, res, `isPossibleSaveAct(${cntrNo},${nextActType})`, false, 500);
    }

})
module.exports = router;