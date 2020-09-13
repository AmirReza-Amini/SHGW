const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const db = sworm.db(setting.db.sqlConfig);
const auth = require('../middleware/auth');

router.get('/getEquipmentsForLoadUnload', auth, async (req, res) => {
    try {
        var result = await db.query(queries.EQUIPMENT.getEquipmentsForLoadUnload);
        // res.socket.emit(Events.LAST_VOYAGES_LOADED, result);
        SendResponse(req, res, result, (result && result.length > 0))
    } catch (error) {
        return SendResponse(req, res, 'getEquipmentsForLoadUnload', false, 500);
    }

})
module.exports = router;