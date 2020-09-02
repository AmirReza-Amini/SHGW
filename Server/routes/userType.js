const express = require('express');
const md5 = require('md5');
const router = express.Router();
const userType = require('../models/userTypes.model')
const { GetAll, Insert, Update, GetOne, Delete, HardDelete, } = require('../util/genericMethods');

router.route('/')
    .get(async (req, res) => {
        console.log('userType', req.body)
        try{
            await GetAll(userType, req, res)
        }
        catch(error){
            console.log(error)
        }
    })
    .post(async (req, res) => {
        if (req.body.option)
            await GetAll(userType, req, res, req.body.option)
        else
            await Insert(userType, req, res);
    })
    .put(async (req, res) => { await Update(userType, req, res) })

router.route('/:id')
    .get(async (req, res) => {
        await GetOne(userType, req, res)
    })
    .put(async (req, res) => { await Update(userType, req, res) })
    .get(async (req, res) => { await GetOne(userType, req, res) })
    .delete(async (req, res) => {
        req.body._id = req.params.id;
        await HardDelete(userType, req, res)
    })

module.exports = router;
