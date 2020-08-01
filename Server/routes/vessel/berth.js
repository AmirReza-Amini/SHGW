const express = require("express");
const router = express.Router();
const Events = require("../../util/EventList");
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const db = sworm.db(setting.db.sqlConfig);

// router.get('/load', async (req, res) => {
//     console.log(Events);
//     res.socket.emit(Events.LOAD, req.body);
//     SendResponse(req, res, { capitan: 'Cntr loaded' })
// })
// router.get('/unload', async (req, res) => {
//     res.socket.emit(Events.UNLOAD, req.body);
//     SendResponse(req, res, { capitan: 'Cntr unloaded' })
// })
// router.get('/damage', async (req, res) => {
//     res.socket.emit(Events.DAMAGE, req.body);
//     SendResponse(req, res, { capitan: 'Damage(s) registered' })
// })

router.post("/getCntrInfoForUnload", async (req, res) => {
  //console.log("result", req);
  var result = await db.query(queries.VESSEL.BERTH.getCntrInfoForUnload, {
    voyageId: req.body.voyageId,
    cntrNo: req.body.cntrNo,
  });
  console.log("result", result);

  SendResponse(req, res, result, result && result.length > 0);
});

router.post("/saveUnload", async (req, res) => {
  //console.log("result", req);
  var result = await db.query(queries.VESSEL.BERTH.saveUnload, {
    voyageId: req.body.voyageId,
    cntrNo: req.body.cntrNo,
    berthId: req.body.berthId,
    userId: req.body.userId,
    equipmentId: req.body.equipmentId,
    operatorId: req.body.operatorId,
    truckNo: req.body.truckNo,
    isShifting: req.body.isShifting,
    sE: req.body.sE,
    oG: req.body.oG,
  });

    let data = result[0][""][0] !=='0' ? {
      ActId: result[0][""][0],
      message: "عملیات با موفقیت انجام شد",
    }:'خطا در انجام عملیات';

    SendResponse(req, res, data, result[0][""][0] !=='0');

  //   db.transaction(() => {
  //     return db.query(queries.VESSEL.BERTH.saveUnload, {
  //     voyageId: req.body.voyageId,
  //     cntrNo: req.body.cntrNo,
  //     berthId: req.body.berthId,
  //     userId: req.body.userId,
  //     equipmentId: req.body.equipmentId,
  //     operatorId: req.body.operatorId,
  //     truckNo: req.body.truckNo,
  //     isShifting: req.body.isShifting,
  //     sE: req.body.sE,
  //     oG: req.body.oG,
  //   })
  //       .then(() => SendResponse(req, res, 'عملیات با موفقیت انجام شد'))
  //       .catch(() => SendResponse(req, res, { error: 'خطای سرور' }, false, 500))
  //   });
});

router.post("/saveUnloadIncrement", async (req, res) => {
  //console.log("result", req);
  var result = await db.query(queries.VESSEL.BERTH.saveUnloadIncrement, {
    voyageId: req.body.voyageId,
    cntrNo: req.body.cntrNo,
    berthId: req.body.berthId,
    userId: req.body.userId,
    equipmentId: req.body.equipmentId,
    operatorId: req.body.operatorId,
    terminalId: req.body.terminalId,
    truckNo: req.body.truckNo,
    isShifting: req.body.isShifting,
    sE: req.body.sE,
    oG: req.body.oG,
  });
  console.log("result", result);
  SendResponse(req, res, "عملیات با موفقیت انجام شد");
});

router.post("/addToShifting", async (req, res) => {
  //console.log("result", req);
  try {
    var result = await db.query(queries.VESSEL.BERTH.addToShifting, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
      staffId: req.body.staffId,
    });
    console.log("result", result);
    if (result && result.length > 0)
      SendResponse(req, res, "کانتینر به لیست شیفتینگ اضافه شد");
    else SendResponse(req, res, "کانتینر به لیست شیفتینگ اضافه نشد", false);
  } catch (error) {
    SendResponse(req, res, error, 400);
  }
});

router.post("/addToLoadingList", async (req, res) => {
  //console.log("result", req);
  try {
    var result = await db.query(queries.VESSEL.BERTH.addToLoadingList, {
      voyageId: req.body.voyageId,
      cntrNo: req.body.cntrNo,
    });
    console.log("result", result);
    if (result && result.length > 0)
      SendResponse(req, res, "کانتینر به لیست دستورالعمل بارگیری اضافه شد");
    else
      SendResponse(
        req,
        res,
        "کانتینر به لیست دستورالعمل بارگیری اضافه نشد",
        false
      );
  } catch (error) {
    SendResponse(req, res, error, 400);
  }
});

router.post("/isExistCntrInInstructionLoading", async (req, res) => {
  //console.log("result", req);
  try {
    var result = await db.query(
      queries.VESSEL.BERTH.isExistCntrInInstructionLoading,
      {
        voyageId: req.body.voyageId,
        cntrNo: req.body.cntrNo,
      }
    );
    console.log("result", result);
    if (result && result.length > 0)
      SendResponse(req, res, result, result && result.length > 0);
    else
      SendResponse(
        req,
        res,
        "کانتینر در لیست دستورالعمل بارگیری وجود ندارد",
        false
      );
  } catch (error) {
    SendResponse(req, res, error, 400);
  }
});

module.exports = router;
