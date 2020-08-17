const express = require('express');
const router = express.Router();
const Events = require('../util/EventList')
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const sql = require('mssql');
const db = sworm.db(setting.db.sqlConfig);
const pool = new sql.ConnectionPool(setting.db.sqlConfig.config);
pool.connect(error => {
    console.log('error sql connection', error);
});

pool.on('error', err => {
    console.log('error sql on', err);
})

router.get('/fetchDamageDefinition', async (req, res) => {
    
    var result = await db.query(queries.DAMAGE.fetchDamageDefinition);
    SendResponse(req, res, result, (result && result.length > 0))
})



router.post('/getDamageInfoByActId', async (req, res) => {

    let actId = req.body.actId || 0;
    var result = await db.query(queries.DAMAGE.getDamageInfoByActId, { actId: actId });
    SendResponse(req, res, result, (result && result.length > 0))
})

router.post('/setDamageInfoByActId', async (req, res) => {

    try {
        const tvp = new sql.Table();
        tvp.columns.add('ActID', sql.BigInt);
        tvp.columns.add('Letters', sql.NVarChar(20));
        tvp.columns.add('Side', sql.SmallInt);
        tvp.columns.add('StaffID', sql.BigInt);

        req.body.data.map(item => tvp.rows.add(item.ActID, item.Letters, item.Side, item.StaffID));
        const request = new sql.Request(pool);
        request.input('DamageList', tvp);
        request.output('OutputResult', sql.NVarChar(2048));
        const temp = await request.execute('SP_SetDamgeBasedOnDamageList');
        const { recordset: result } = temp;
        let message = "";
        if (result && result.length > 0) {
            let success = result.filter(c => c["Result"] == '1');
            let fail = result.filter(c => c["Result"] == '0');
            if (success && success.length == req.body.data.length) {
                message = "خسارت کانتینر ثبت شد"
                return SendResponse(req, res, message, true);
            }
            else if (fail && fail.length == req.body.data.length) {
                message = "خسارت کانتینر ثبت نشد"
                return SendResponse(req, res, message, false);
            }
            else if (success && success.length > 0 || fail && fail.length > 0) {
                message = `namovafagh ${fail.length} movafagh ${success.length}`;
                return SendResponse(req, res, message, true);
            }
        }
        else {
            message = "خسارت کانتینر ثبت نشد"
            return SendResponse(req, res, message, false);
        }
    }
    catch (err) {
        message = "خطا در برقراری ارتباط با سرور"
        return SendResponse(req, res, message, false);
    }
    // res.socket.emit(Events.LAST_VOYAGES_LOADED, result);
})
module.exports = router;