const express = require('express');
const router = express.Router();
const setting = require('../app-setting')
const pCal = require('ara-persian-cal');

router.get('/', (req, res) => {
    res.send(`<h4 style='color:red;text-align:center;margin-top:10%'>
    Server started on Port ${setting.portNo} *** ${pCal.ToPersian(new Date().toISOString().split('T')[0]) + ' ' + new Date().toLocaleTimeString()}
     </h4>`)
});

module.exports = router;
