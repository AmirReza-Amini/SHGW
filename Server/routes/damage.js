const express = require('express');
const router = express.Router();
const { SendResponse } = require('../util/utility')
const queries = require('../util/T-SQL/queries')
const setting = require('../app-setting')
const sworm = require('sworm');
const sql = require('mssql');
const auth = require('../middleware/auth');
const pool = require('../bootstrap/sqlserver');
const { DoesUserHavePermission } = require('../util/CheckPermission');

const db = sworm.db(setting.db.sqlConfig);

router.get('/getDamageDefinition', auth, async (req, res) => {
    try {
        // console.log(req.body);
        var result = await db.query(queries.DAMAGE.getDamageDefinition);
        SendResponse(req, res, result, (result && result.length > 0))
    } catch (error) {
        return SendResponse(req, res, 'getDamageDefinition', false, 500);
    }
})

router.post('/getDamageInfoByActId', auth, async (req, res) => {
    if (!req.body.actId)
        return SendResponse(req, res, "Input data is not valid", false, 400);
    try {
        let actId = req.body.actId || 0;
        var result = await db.query(queries.DAMAGE.getDamageInfoByActId, { actId: actId });
        SendResponse(req, res, result, (result && result.length > 0))
    } catch (error) {
        return SendResponse(req, res, 'getDamageInfoByActId', false, 500);
    }
})

router.post('/setDamageInfoByActId', auth, async (req, res) => {

    if (!req.body.data)
        return SendResponse(req, res, "Input data is not valid", false, 400);

        const check = await DoesUserHavePermission(req.user, 'Vessel', 'Damage')
        if (check.result) {
            try {
                // const pool = new sql.ConnectionPool(setting.db.sqlConfig.config);
                // pool.connect(error => {
                //     console.log('error sql connection damage', error);
                // });

                // pool.on('error', err => {
                //     console.log('error sql on damage', err);
                // })

                //console.log(req.body)

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
                        message = "The container damage has been saved successfully"
                        return SendResponse(req, res, message, true);
                    }
                    else if (fail && fail.length == req.body.data.length) {
                        message = "The container damage has not been saved"
                        return SendResponse(req, res, message, false);
                    }
                    else if (success && success.length > 0 || fail && fail.length > 0) {
                        message = `namovafagh ${fail.length} movafagh ${success.length}`;
                        return SendResponse(req, res, message, true);
                    }
                }
                else {
                    message = "The container damage has not been saved"
                    return SendResponse(req, res, message, false);
                }
            }
            catch (err) {
                return SendResponse(req, res, 'setDamageInfoByActId', false, 500);
            }
        }
        else {
            return SendResponse(req, res, check.message, check.result, check.statusCode);
        }
})
module.exports = router;