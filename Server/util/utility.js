const fs = require('fs');
const Log = require('./Logger');
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const pc = require('ara-persian-cal')
const { tokenHashKey, jwtSecret, jwtExpireTime } = require('../app-setting');

exports.Map = (source, dest, excludeList = []) => {
    let propertyList = Object.getOwnPropertyNames(source).filter(m => !excludeList.includes(m));
    propertyList.forEach(p => {
        dest[p] = source[p];
    })
}

exports.SendResponse = (req, res, data, result = true, code = 200) => {

    req.body.status = code;
    req.body.to = req.body.from;
    req.body.data = data;
    delete req.body.from;
    const a = req.user ? this.GenerateAuthToken(req.user) : null;
     console.log('send res',a)
    //console.log('toke is:', a);
    Log({ type: result ? 'info' : 'error', res: req.body })

    res.status(code).json(
        Object.assign(req.base, {
            result: result,
            data: Array.isArray(data) ? data : [data],
            token: a
        }))
}

exports.GenerateAuthToken = (user) => {
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


exports.LoadText = (filePath) => {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

exports.ToPersian = (garegorianDate) => {
    let cleanedDate = garegorianDate
        .toISOString()
        .replace('T', ' ')
        .replace('Z', ' ');
    return pc.ToPersian(cleanedDate, 'YYYY/MM/DD HH:mm')
}

exports.ConvertProperties = (object, keys, method) => {
    keys.forEach(key => {
        object[key] = method(object[key])
    });
    return object;
}