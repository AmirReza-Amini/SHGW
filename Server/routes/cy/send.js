const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const auth = require("../../middleware/auth");
const { DoesUserHavePermission } = require('../../util/CheckPermission');
const db = sworm.db(setting.db.sqlConfig);

//#region Send APIs -----------------------------------------------------------------------


router.post("/isAlreadySentCntrNoByOperatorInVoyage", auth, async (req, res) => {

    //console.log(req.body)
    try {
        var result = await db.query(queries.CY.SEND.isAlreadySentCntrNoByOperatorInVoyage, {
            cntrNo: req.body.cntrNo,
            voyageId: req.body.voyageId,
            operatorId: req.body.operatorId,
            equipmentId: req.body.equipmentId
        });

        //console.log('isAlreadySentCntrNoByOperatorInVoyage',result,req.body);
        if (result && result.length > 0)
            return SendResponse(req, res, "This container has been sent already", true);
        else
            return SendResponse(req, res, "Send operation is valid", false);
    }
    catch (error) {
        return SendResponse(req, res, `isAlreadySentCntrNoByOperatorInVoyage(${req.body.cntrNo},${req.body.voyageId})`, false, 500);
    }
});

router.post("/saveSend", auth, async (req, res) => {
    const check = await DoesUserHavePermission(req.user, 'CY', 'Send');
    console.log('checkkkkkk', check);
    if (check.result) {
        try {
            //console.log('save send', req.user, req.body)
            var result = await db.query(queries.CY.SEND.saveSend, {
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
                truckNo: req.body.truckNo,
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

