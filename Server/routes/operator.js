const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const db = sworm.db(setting.db.sqlConfig);
const auth = require('../middleware/auth');

router.get('/getOperatorInfoBasedOnCode/:code',auth, async (req, res) => {
    let code = req.params.code || 0;
    var result = await db.query(queries.OPERATOR.getOperatorInfoBasedOnCode, { code: code });
     res.socket.emit(Events.LAST_VOYAGES_LOADED, result);
    SendResponse(req, res, result, (result && result.length > 0))
})
module.exports = router;