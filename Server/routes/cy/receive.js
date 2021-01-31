const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const auth = require("../../middleware/auth");
const { DoesUserHavePermission } = require('../../util/CheckPermission');
const db = sworm.db(setting.db.sqlConfig);

router.post("/getCntrInfoForReceive", auth, async (req, res) => {
    try {
        var result = await db.query(queries.CY.RECEIVE.getCntrInfoForReceive, {
            cntrNo: req.body.cntrNo,
        });
        return SendResponse(req, res, result, result && result.length > 0);
    } catch (error) {
        return SendResponse(req, res, `getCntrInfoForReceive(${req.body.cntrNo})`, false, 500);
    }
});

router.post("/saveReceive", auth, async (req, res) => {
    const check = await DoesUserHavePermission(req.user, 'CY', 'Receive');
    if (check.result) {
        try {
            //console.log('save send', req.user, req.body)
            var result = await db.query(queries.CY.RECEIVE.saveReceive, {
                voyageId: req.body.voyageId,
                cntrNo: req.body.cntrNo,
                cntrLocation: req.body.cntrLocation,
                actId: req.body.actId,
                operatorId: req.body.operatorId,
                equipmentId: req.body.equipmentId,
                truckNo:req.body.truckNo,
                userId: req.user.userId
            });

            //console.log('result send save', result);
            let data = result[0]['OutVal'] !== false ? {
                ActID: result[0]['ActID'],
                message: "The operation has been done successfully",
            } : "Operation failed";

            //console.log(result, result[0]['OutVal']);

            return SendResponse(req, res, data, result[0]['OutVal']);
        } catch (error) {
            //console.log(error)
            return SendResponse(req, res, 'saveSend', false, 500);
        }
    }
    else {
        return SendResponse(req, res, check.message, check.result, check.statusCode);
    }
});

module.exports = router;