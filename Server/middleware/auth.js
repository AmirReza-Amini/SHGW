const { tokenHashKey, jwtSecret,requiresAuth} = require('../app-setting')
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const { SendResponse } = require('../util/utility')
const CryptoJs = require('crypto-js');


module.exports = async (req, res, next) => {
    if (!requiresAuth) return next();
    const encryptedToken = req.headers['x-auth-token'];
    console.log('from server:' ,encryptedToken);
    if (!encryptedToken) return SendResponse(req, res, { error: 'دسترسی مقدور نیست. توکن یافت نشد' }, false,401);//res.sendStatus(401).send('Access denied. No token provided');
    try {
        //let encryptedToken = token.split(' ')[1].replace(/['"]+/g, '');
        let token = AES.decrypt(encryptedToken, tokenHashKey).toString(CryptoJs.enc.Utf8)

        jwt.verify(token, jwtSecret, async (error, decoded) => {
            if (error) {
                //console.log('from Auth middleWare',error)
                SendResponse(req, res, 'توکن اکسپایر شده', false,403)
               // res.sendStatus(403);
            }
            else {
                req.user = decoded;
               // console.log('from eeeeeeeeee',req.user)
            }
        })
        next();
    }
    catch (ex) {
        SendResponse(req, res, 'دسترسی مقدور نیست.اطلاعات دستکاری شده است.', false,403)
    }
}