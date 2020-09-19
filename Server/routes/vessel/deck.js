const express = require('express');
const router = express.Router();
const { SendResponse } = require('../../util/utility');
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const auth = require('../../middleware/auth');
const { DoesUserHavePermission } = require('../../util/CheckPermission');
const db = sworm.db(setting.db.sqlConfig);


//#region Stowage Services -------------------------------------------------------------------------

router.post("/getCntrInfoForStowage", auth, async (req, res) => {
    try {
        //console.log(req.body)
        var result = await db.query(queries.VESSEL.DECK.getCntrInfoForStowage, {
            voyageId: req.body.voyageId,
            cntrNo: req.body.cntrNo,
        });
        console.log(result)
        return SendResponse(req, res, result, result && result.length > 0);
    } catch (error) {
        return SendResponse(req, res, 'getCntrInfoForStowage', false, 500);
    }
});

router.post("/getStowageInfoForCntrByVoyage", auth, async (req, res) => {

    try {
        //console.log(req.body)
        var result = await db.query(queries.VESSEL.DECK.getStowageInfoForCntrByVoyage, {
            voyageId: req.body.voyageId,
            cntrNo: req.body.cntrNo,
        });
        //console.log(result)
        return SendResponse(req, res, result, result && result.length > 0);
    } catch (error) {
        return SendResponse(req, res, 'getStowageInfoForCntrByVoyage', false, 500);
    }

});

router.post("/isOccoupiedBayAddressInVoyage", auth, async (req, res) => {
    //console.log(req.body)
    try {
        var result = await db.query(queries.VESSEL.DECK.isOccoupiedBayAddressInVoyage, {
            voyageId: req.body.voyageId,
            loadingBayAddress: req.body.loadingBayAddress,
        });

        if (result && result.length > 0)
            return SendResponse(req, res, `پر شده ${result[0].CntrNo} توسط کانتینر`, true);

        else
            return SendResponse(req, res, 'معتبر است', false);
    }
    catch (error) {
        return SendResponse(req, res, 'isOccoupiedBayAddressInVoyage', false, 500);
    }
});

router.post("/saveStowageAndShiftedup", auth, async (req, res) => {

    const check = await DoesUserHavePermission(req.user, 'Vessel', 'Stowage');
    if (check.result) {
        //console.log(req.body)
        try {
            var result = await db.query(queries.VESSEL.DECK.saveStowageAndShiftedup, {
                cntrNo: req.body.cntrNo,
                voyageId: req.body.voyageId,
                userId: req.body.userId,
                equipmentId: req.body.equipmentId,
                operatorId: req.body.operatorId,
                bayAddress: req.body.bayAddress,
                actType: req.body.actType
            });

            //console.log('result saveStowageAndShiftedup', result);
            //result saveStowageAndShiftedup [ { '': false } ]
            let data = result[0][""] !== false ? "The operation has been done successfully" : "Operation failed";

            return SendResponse(req, res, data, result[0][""] !== false);
        }
        catch (error) {
            //console.log(error);
            return SendResponse(req, res, 'saveStowageAndShiftedup', false, 500);
        }
    }
    else {
        return SendResponse(req, res, check.message, check.result, check.statusCode);
    }
});

//#endregion -------------------------------------------------------------------------------------

module.exports = router;