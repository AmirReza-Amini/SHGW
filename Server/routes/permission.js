const express = require('express');
const md5 = require('md5');
const router = express.Router();
const Permission = require('../models/permissions.model')
const { GetAll, Insert, Update, GetOne, Delete, HardDelete, } = require('../util/genericMethods');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.route('/')
    .get([auth, admin],async (req, res) => {
        //console.log('permission', req.body)
        await GetAll(Permission, req, res)
    })
    .post([auth, admin],async (req, res) => {
        if (req.body.option)
            await GetAll(Permission, req, res, req.body.option)
        else
            await Insert(Permission, req, res);
    })
    .put([auth, admin],async (req, res) => { await Update(Permission, req, res) })

router.route('/:id')
    .get([auth, admin],async (req, res) => {
        await GetOne(Permission, req, res)
    })
    .put([auth, admin],async (req, res) => { await Update(Permission, req, res) })
    .get([auth, admin],async (req, res) => { await GetOne(Permission, req, res) })
    .delete([auth, admin],async (req, res) => {
        req.body._id = req.params.id;
        await HardDelete(Permission, req, res)
    })

module.exports = router;
