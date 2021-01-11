const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const auth = require("../../middleware/auth");
const { DoesUserHavePermission } = require('../../util/CheckPermission');
const db = sworm.db(setting.db.sqlConfig);

//#region Yard Operation Services -----------------------------------------------------------------------

router.post("/getCntrInfoForYardOperation", auth, async (req, res) => {
    try {
        var result = await db.query(queries.CY.YARDOPERATION.getCntrInfoForYardOperation, {
            cntrNo: req.body.cntrNo,
        });
        return SendResponse(req, res, result, result && result.length > 0);
    } catch (error) {
        return SendResponse(req, res, `getCntrInfoForYardOperation(${req.body.cntrNo})`, false, 500);
    }
});

router.post("/saveYardOperation", auth, async (req, res) => {
    const check = await DoesUserHavePermission(req.user, 'CY', 'Yard-Operation');
    if (check.result) {
        try {
            console.log('saveYardOperation', req.user, req.body)
            var result = await db.query(queries.CY.YARDOPERATION.saveYardOperation, {
                operatorId: req.body.operatorId,
                equipmentId: req.body.equipmentId,
                userId: req.user.userId,
                cntrNo: req.body.cntrNo,
                voyageId: req.body.voyageId,
                cntrLocation: req.body.cntrLocation,
                actId: req.body.actId,
                truckNo: req.body.truckNo
            });

            let data = result[0]['OutVal'] !== false ? {
                ActID: result[0]['ActID'],
                message: "The operation has been done successfully",
            } : "Operation failed";

            console.log('result saveYardOperation', result, data);

            return SendResponse(req, res, data, result[0]['OutVal']);
        } catch (error) {
            console.log(error)
            return SendResponse(req, res, 'saveYardOperation', false, 500);
        }
    }
    else {
        return SendResponse(req, res, check.message, check.result, check.statusCode);
    }
});

module.exports = router;