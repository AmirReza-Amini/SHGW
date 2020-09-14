const express = require('express');
const router = express.Router();
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const auth = require('../middleware/auth');
const { DoesUserHavePermission } = require('../util/CheckPermission');
const db = sworm.db(setting.db.sqlConfig);

router.get('/:count?', auth, async (req, res) => {
  try {
    let count = req.params.count || 10;
    //console.log('from voyage', req.params, count);
    var result = await db.query(queries.VOYAGE.loadLastVoyages, { count: count });
    SendResponse(req, res, result, (result && result.length > 0))
  } catch (error) {
    return SendResponse(req, res, `voyage(${req.params.count})`, false, 500);
  }

});

router.post('/getLoadUnloadStatisticsByVoyageId', auth, async (req, res) => {
  const check = await DoesUserHavePermission(req.user, 'Vessel', 'Statistics');
  if (check.result) {
    try {
      let voyageId = req.body.voyageId || 0;
      // console.log(req.body);
      var result = await db.query(queries.VOYAGE.getLoadUnloadStatisticsByVoyageId, { voyageId: voyageId });
      //console.log(result);
      res.io.emit("get_data", result);
      SendResponse(req, res, result, (result && result.length > 0))
    } catch (error) {
      return SendResponse(req, res, `getLoadUnloadStatisticsByVoyageId(${req.body.voyageId})`, false, 500);
    }
  }
  else {
    return SendResponse(req, res, check.message, check.result, check.statusCode);
  }
})



module.exports = router;