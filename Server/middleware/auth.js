const { tokenHashKey, jwtSecret, requiresAuth } = require('../app-setting')
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const { SendResponse } = require('../util/utility')
const CryptoJs = require('crypto-js');
const Users = require('../models/users.model');


module.exports = async (req, res, next) => {
    if (!requiresAuth) return next();
    const encryptedToken = req.headers['x-auth-token'];
    //console.log('from server:' ,encryptedToken);
    if (!encryptedToken) return SendResponse(req, res, 'دسترسی مقدور نیست.اطلاعات دستکاری شده است', false, 401);
    try {
        let token = AES.decrypt(encryptedToken, tokenHashKey).toString(CryptoJs.enc.Utf8)

        jwt.verify(token, jwtSecret, async (error, decoded) => {
            if (error) {
                console.log('from Auth middleWare', error)
                if (error.name == 'TokenExpiredError')
                    return SendResponse(req, res, 'مدت زمان زیادی از لحظه ی ورود شما به سیستم گذشته است. دوباره وارد شوید', false, 401);
                else
                    return SendResponse(req, res, 'دسترسی غیر مجاز', false, 403);
            }
            else {
                console.log('auth decode', decoded);
                let userInfo = await Users.findOne({ _id: decoded._id });
                if (!userInfo.isActive)
                    return SendResponse(req, res, 'اکانت مورد نظر غیر فعال می باشد', false, 200);
                req.user = userInfo;
                next();
            }
        })
    }
    catch (ex) {
        return SendResponse(req, res, 'دسترسی مقدور نیست.اطلاعات دستکاری شده است', false, 401)
    }
}