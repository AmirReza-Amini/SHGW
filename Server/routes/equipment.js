const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const db = sworm.db(setting.db.sqlConfig);

router.get('/fetchEquipmentsForUnload', async (req, res) => {
    let count = req.params.count || 10;
    //console.log('resultdb',db)
    

    var result = await db.query(queries.EQUIPMENT.fetchEquipmentsForUnload);
    console.log('result',result)
   // res.socket.emit(Events.LAST_VOYAGES_LOADED, result);

    SendResponse(req, res, result, (result && result.length > 0))
})
module.exports = router;