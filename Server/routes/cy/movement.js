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

router.post("/getCntrInfoForMovement", auth, async (req, res) => {
    try {
        var result = await db.query(queries.CY.MOVEMENT.getCntrInfoForMovement, {
            cntrNo: req.body.cntrNo,
        });
        return SendResponse(req, res, result, result && result.length > 0);
    } catch (error) {
        return SendResponse(req, res, `getCntrInfoForMovement(${req.body.cntrNo})`, false, 500);
    }
});

router.post("/isDuplicateYardCodeByCntrNoInVoyage", auth, async (req, res) => {

    //console.log(req.body)
    try {
        var result = await db.query(queries.CY.MOVEMENT.isDuplicateYardCodeByCntrNoInVoyage, {
            cntrNo: req.body.cntrNo,
            voyageId: req.body.voyageId,
            yardCode: req.body.yardCode
        });

        console.log(result,req.body);
        if (result && result.length > 0)
            return SendResponse(req, res, "Duplicate Yard", true);
        else
            return SendResponse(req, res, "Location is valid", false);
    }
    catch (error) {
        return SendResponse(req, res, `isDuplicateYardCodeByCntrNoInVoyage(${req.body.cntrNo},${req.body.voyageId})`, false, 500);
    }
});

router.post("/saveMovement", auth, async (req, res) => {
    const check = await DoesUserHavePermission(req.user, 'CY', 'Movement');
    if (check.result) {
        try {
            console.log('save movement', req.user, req.body)
            var result = await db.query(queries.CY.MOVEMENT.saveMovement, {
                voyageId: req.body.voyageId,
                cntrNo: req.body.cntrNo,
                cntrLocation: req.body.cntrLocation,
                fullEmptyStatus: req.body.fullEmptyStatus,
                cntrId: req.body.cntrId,
                ownerId: req.body.ownerId,
                agentId: req.body.agentId,
                terminalId: req.body.terminalId,
                operatorId: req.body.operatorId,
                equipmentId: req.body.equipmentId,
                userId: req.user.userId
            });

            console.log('result movement save', result);
            let data = result[0]['OutVal'] !== false ? {
                ActID: result[0]['ActID'],
                message: "The operation has been done successfully",
            } : "Operation failed";

            console.log(result, result[0]['OutVal']);

            return SendResponse(req, res, data, result[0]['OutVal']);
        } catch (error) {
            console.log(error)
            return SendResponse(req, res, 'saveMovement', false, 500);
        }
    }
    else {
        return SendResponse(req, res, check.message, check.result, check.statusCode);
    }
});

module.exports = router;

