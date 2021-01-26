const mapper = require('./utility')
const md5 = require('md5')
const { SendResponse } = require('./utility')

exports.Insert = async (entity, req, res) => {

    let obj = new entity(req.body);
    await obj.save();
    SendResponse(req, res, obj);
}

exports.InsertMany = async (entity, req, res) => {
    let obj = await entity.insertMany(req.body);
    SendResponse(req, res, obj);
}

exports.Update = async (entity, req, res) => {
    FindAndUpdate(entity, req, res, { _id: req.body._id }, req.body);
};

exports.HardDelete = async (entity, req, res) => {
    console.log(req.body)
    let doc = await entity.findByIdAndRemove(req.body._id);
    if (doc) {
        if (req.user && req.user.userType === "Admin" && doc.userType === "Admin") {
            return SendResponse(req, res, "Access to this section is forbidden", false, 403);
        }
        SendResponse(req, res, doc);
    }
    else
        SendResponse(req, res, { error: 'nothing found!' }, false, 404);
}

exports.GetAll = async (entity, req, res, opt = {}, sendResponse = true) => {

    sortTerm = opt.sort ? opt.sort : '_id';

    condition = opt.condition ? opt.condition : {}

    //condition.isDeleted = false;
    filter = opt.filter ? opt.filter : {};
    take = opt.take ? opt.take : 0;
    skip = opt.skip ? opt.skip : 0;
    populate = opt.populate ? opt.populate : '';
    let doc = await entity
        .find(condition)
        .select(filter)
        .sort(sortTerm)
        .skip(skip)
        .limit(take)
        .populate(populate);
    if (!sendResponse)
        return doc;
    SendResponse(req, res, doc, doc != null)
}

exports.GetOne = async (entity, req, res, opt = {}, sendResponse = true) => {
    condition = opt.condition ? opt.condition : {}
    //condition.isDeleted = false;
    populate = opt.populate ? opt.populate : '';
    filter = opt.filter ? opt.filter : {};
    let doc = await entity
        .findOne(condition)
        .select(filter)
        .populate(populate);
    if (!sendResponse)
        return doc;
    SendResponse(req, res, doc, doc != null)
}

FindAndUpdate = async (entity, req, res, condition, update) => {
    let doc = await entity.findOne(condition);
    if (doc) {

        //console.log('user edt info',req.user)
        if (req.user && req.user.userType === "Admin" && doc.userType === "Admin") {
            return SendResponse(req, res, "Access to this section is forbidden", false, 403);
        }
        
        if (update.password)
            update.password = md5(update.password).toUpperCase();

        mapper.Map(update, doc);
        try {
            delete doc['__v'];
            await doc.save();
            SendResponse(req, res, doc);
        } catch (error) {
            console.log(error);
        }

    }
    else
        SendResponse(res, res, { error: 'nothing found!' }, false, 404);
}