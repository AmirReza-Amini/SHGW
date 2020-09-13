const express = require('express');
const router = express.Router();
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const sql = require('mssql');
const auth = require('../middleware/auth');
const pool = require('../bootstrap/sqlserver');

const db = sworm.db(setting.db.sqlConfig);

router.get('/getDamageDefinition', auth, async (req, res) => {

    console.log(req.body);
    var result = await db.query(queries.DAMAGE.getDamageDefinition);
    SendResponse(req, res, result, (result && result.length > 0))
})



router.post('/getDamageInfoByActId', auth, async (req, res) => {

    let actId = req.body.actId || 0;
    var result = await db.query(queries.DAMAGE.getDamageInfoByActId, { actId: actId });
    SendResponse(req, res, result, (result && result.length > 0))
})

router.post('/setDamageInfoByActId', auth, async (req, res) => {

    try {

        // const pool = new sql.ConnectionPool(setting.db.sqlConfig.config);
        // pool.connect(error => {
        //     console.log('error sql connection damage', error);
        // });

        // pool.on('error', err => {
        //     console.log('error sql on damage', err);
        // })

        console.log(req.body)

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
        //     [ { Result: true, Message: 'OK', ID: 1 },
        //       { Result: true, Message: 'OK', ID: 2 } ],
        // console.log(temp);
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
        console.log(err)
        message = "خطا در برقراری ارتباط با سرور"
        return SendResponse(req, res, message, false);
    }
    // res.socket.emit(Events.LAST_VOYAGES_LOADED, result);
})
module.exports = router;