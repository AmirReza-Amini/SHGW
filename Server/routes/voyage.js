const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const db = sworm.db(setting.db.sqlConfig);

router.get('/:count?', async (req, res) => {
    let count = req.params.count || 10;
    var result = await db.query(queries.VOYAGE.loadLastVoyages, { count: count });
    //console.log('from voyage', result);
    SendResponse(req, res, result, (result && result.length > 0))
});

router.post('/getLoadUnloadStatisticsByVoyageId',[auth,admin], async (req, res) => {
    let voyageId = req.body.voyageId || 0;
  //  console.log(req.body);
    var result = await db.query(queries.VOYAGE.getLoadUnloadStatisticsByVoyageId, { voyageId: voyageId });
    //console.log(result);
    res.io.emit("get_data",result);
    SendResponse(req, res, result, (result && result.length > 0))
})



module.exports = router;