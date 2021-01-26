const express = require('express');
const md5 = require('md5');
const router = express.Router();
const userType = require('../models/userTypes.model')
const { GetAll, Insert, Update, GetOne, Delete, HardDelete, } = require('../util/genericMethods');
const auth = require('../middleware/auth');
const adminOrSuperuser = require('../middleware/adminOrSuperuser');

router.route('/')
    .get([auth, adminOrSuperuser],async (req, res) => {
        //console.log('userType', req.body)
        try {
            let options = { condition: { name: { $ne: 'Superuser' } } }
            await GetAll(userType, req, res, options)
        }
        catch(error){
            console.log(error)
        }
    })
    // .post([auth, admin],async (req, res) => {
    //     if (req.body.option)
    //         await GetAll(userType, req, res, req.body.option)
    //     else
    //         await Insert(userType, req, res);
    // })
    // .put([auth, admin],async (req, res) => { await Update(userType, req, res) })

router.route('/:id')
    .get([auth, adminOrSuperuser],async (req, res) => {
        await GetOne(userType, req, res)
    })
    // .put([auth, admin],async (req, res) => { await Update(userType, req, res) })
    // .get([auth, admin],async (req, res) => { await GetOne(userType, req, res) })
    // .delete([auth, admin],async (req, res) => {
    //     req.body._id = req.params.id;
    //     await HardDelete(userType, req, res)
    // })

module.exports = router;
