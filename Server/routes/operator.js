const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const db = sworm.db(setting.db.sqlConfig);
const auth = require('../middleware/auth');

router.get('/getOperatorInfoBasedOnCode/:code', auth, async (req, res) => {

    try {
        let code = req.params.code || 0;
        var result = await db.query(queries.OPERATOR.getOperatorInfoBasedOnCode, { code: code });
        //console.log(result)
        if (result && result.length > 0) {
            if (result[0].StaffIsActive)
                return SendResponse(req, res, result, (result && result.length > 0))
            else
                return SendResponse(req, res, 'Operator isn\'t active', false)
        }
        return SendResponse(req, res, 'Operator not found', false)
    } catch (error) {
        return SendResponse(req, res, `getOperatorInfoBasedOnCode(${req.params.code})`, false, 500);
    }

})
module.exports = router;