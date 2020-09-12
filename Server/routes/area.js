const express = require('express');
const md5 = require('md5');
const router = express.Router();
const Area = require('../models/areas.model')
const { GetAll, Insert, Update, GetOne, Delete, HardDelete, } = require('../util/genericMethods');

router.route('/')
    .get(async (req, res) => {
        console.log('Area', req.body)
        await GetAll(Area, req, res,{condition:{isActive:true}})
    })
    .post(async (req, res) => {
        if (req.body.option)
            await GetAll(Area, req, res, req.body.option)
        else
            await Insert(Area, req, res);
    })
    .put(async (req, res) => { await Update(Area, req, res) })

router.route('/:id')
    .get(async (req, res) => {
        await GetOne(Area, req, res)
    })
    .put(async (req, res) => { await Update(Area, req, res) })
    .get(async (req, res) => { await GetOne(Area, req, res) })
    .delete(async (req, res) => {
        req.body._id = req.params.id;
        await HardDelete(Area, req, res)
    })

module.exports = router;
