const express = require('express');
const md5 = require('md5');
const router = express.Router();
const Permission = require('../models/permissions.model')
const { GetAll, Insert, Update, GetOne, Delete, HardDelete, } = require('../util/genericMethods');

router.route('/')
    .get(async (req, res) => {
        //console.log('permission', req.body)
        await GetAll(Permission, req, res)
    })
    .post(async (req, res) => {
        if (req.body.option)
            await GetAll(Permission, req, res, req.body.option)
        else
            await Insert(Permission, req, res);
    })
    .put(async (req, res) => { await Update(Permission, req, res) })

router.route('/:id')
    .get(async (req, res) => {
        await GetOne(Permission, req, res)
    })
    .put(async (req, res) => { await Update(Permission, req, res) })
    .get(async (req, res) => { await GetOne(Permission, req, res) })
    .delete(async (req, res) => {
        req.body._id = req.params.id;
        await HardDelete(Permission, req, res)
    })

module.exports = router;
