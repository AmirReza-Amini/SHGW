const fs = require('fs');
const Log = require('./Logger');
const r = require('redis')
//const redis = r.createClient();
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const { tokenHashKey, jwtSecret, jwtExpireTime } = require('../app-setting');
const Users = require('../models/users.model');

map = (source, dest, excludeList = []) => {
    let propertyList = Object.getOwnPropertyNames(source).filter(m => !excludeList.includes(m));
    propertyList.forEach(p => {
        dest[p] = source[p];
    })
}

sendResponse = (req, res, data, result = true, code = 200) => {

    req.body.status = code;
    req.body.to = req.body.from;
    req.body.data = data;
    delete req.body.from;
    const a = req.user ? generateAuthToken(req.user) : null;
   // console.log('send res',a)
    //console.log('toke is:', a);
    Log({ type: result ? 'info' : 'error', res: req.body })

    res.status(code).json(
        Object.assign(req.base, {
            result: result,
            data: Array.isArray(data) ? data : [data],
            token: a
        }))
}

generateAuthToken = (user) => {
    console.log('generateAuthToken',user)
    const token = jwt.sign({
        _id: user._id,
        lastName: user.lastName,
        firstName: user.firstName,
        permissions: user.permissions,
        area: user.area,
        userType: user.userType
    }, jwtSecret, { expiresIn: jwtExpireTime });

    const tokenCrypted = AES.encrypt(
        token,
        tokenHashKey
    ).toString();

    return tokenCrypted
}

buildConnectionString = (cnnData) => {
    let str = `data source=${cnnData.server};initial catalog=${cnnData.DbName};persist security info=True;user id=${cnnData.userName};password=${cnnData.password};MultipleActiveResultSets=True;`
    return str;
}
getConnectionString = async (userName) => {
    return new Promise((resolve, reject) =>
        redis.get(userName, (err, reply) => {
            if (err) reject(err)
            else resolve(reply);
        }))
};

loadText = (filePath) => {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

module.exports = {
    Map: map,
    SendResponse: sendResponse,
    LoadText: loadText,
    ConnectionString: {
        Build: buildConnectionString,
        Get: getConnectionString
    },
    GenerateAuthToken: generateAuthToken
}