const express = require('express');
const md5 = require('md5');
const router = express.Router();
const Area = require('../models/areas.model')
const { GetAll, Insert, Update, GetOne, Delete, HardDelete, } = require('../util/genericMethods');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.route('/')
    .get(async (req, res) => {
        console.log('Area', req.body)
        await GetAll(Area, req, res,{condition:{isActive:true}})
    })
    .post([auth, admin],async (req, res) => {
        if (req.body.option)
            await GetAll(Area, req, res, req.body.option)
        else
            await Insert(Area, req, res);
    })
    .put([auth, admin],async (req, res) => { await Update(Area, req, res) })

router.route('/:id')
    .get([auth, admin],async (req, res) => {
        await GetOne(Area, req, res)
    })
    .put([auth, admin],async (req, res) => { await Update(Area, req, res) })
    .get([auth, admin],async (req, res) => { await GetOne(Area, req, res) })
    .delete([auth, admin],async (req, res) => {
        req.body._id = req.params.id;
        await HardDelete(Area, req, res)
    })

module.exports = router;
