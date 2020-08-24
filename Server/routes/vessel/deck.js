const express = require('express');
const router = express.Router();
const Log = require('../../models/log.model');
const { Events } = require('../../util/EventList')
const { GetAll, Insert, DeleteById } = require('../../util/GenericMethods');
const { SendResponse } = require('../../util/utility');
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);


// router.route('/')
//     .get(async (req, res) => {
//        SendResponse(req,res,{res:'Hello from Vessel'})
//     })


//#region Stowage Services -------------------------------------------------------------------------

router.post("/getCntrInfoForStowage", async (req, res) => {

    console.log(req.body)
    var result = await db.query(queries.VESSEL.DECK.getCntrInfoForStowage, {
        voyageId: req.body.voyageId,
        cntrNo: req.body.cntrNo,
    });
    console.log(result)
    SendResponse(req, res, result, result && result.length > 0);
});

router.post("/getStowageInfoForCntrByVoyage", async (req, res) => {

    //console.log(req.body)
    var result = await db.query(queries.VESSEL.DECK.getStowageInfoForCntrByVoyage, {
        voyageId: req.body.voyageId,
        cntrNo: req.body.cntrNo,
    });
    //console.log(result)
    SendResponse(req, res, result, result && result.length > 0);
});

router.post("/isOccoupiedBayAddressInVoyage", async (req, res) => {

    //console.log(req.body)
    try {
        var result = await db.query(queries.VESSEL.DECK.isOccoupiedBayAddressInVoyage, {
            voyageId: req.body.voyageId,
            loadingBayAddress: req.body.loadingBayAddress,
        });

        if (result && result.length > 0)
            SendResponse(req, res, `پر شده ${result[0].CntrNo} توسط کانتینر`, true);

        else
            SendResponse(req, res, 'معتبر است', false);
    }
    catch (error) {
        SendResponse(req, res, error, 400);
    }

    //console.log(result)
    SendResponse(req, res, result, result && result.length > 0);
});

router.post("/saveStowageAndShiftedup", async (req, res) => {

    console.log(req.body)
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

        console.log('result saveStowageAndShiftedup', result);
        //result saveStowageAndShiftedup [ { '': false } ]
        let data = result[0][""] !== false ? "عملیات با موفقیت انجام شد" : 'خطا در انجام عملیات';

        SendResponse(req, res, data, result[0][""] !== false);
    }
    catch (error) {
        console.log(error);
        SendResponse(req, res, error,false, 400);
    }

    //console.log(result)
    SendResponse(req, res, result, result && result.length > 0);
});

//#endregion -------------------------------------------------------------------------------------

module.exports = router;