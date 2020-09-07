const { tokenHashKey, jwtSecret,requiresAuth} = require('../app-setting')
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const { SendResponse } = require('../util/utility')
const CryptoJs = require('crypto-js');


module.exports = async (req, res, next) => {
    if (!requiresAuth) return next();
    const token = req.headers['x-auth-token'];
    if (!token) return SendResponse(req, res, { error: 'دسترسی مقدور نیست. توکن یافت نشد' }, false,401);//res.sendStatus(401).send('Access denied. No token provided');
    try {
        //let encryptedToken = token.split(' ')[1].replace(/['"]+/g, '');
        let token = AES.decrypt(encryptedToken, tokenHashKey).toString(CryptoJs.enc.Utf8)

        jwt.verify(token, jwtSecret, async (error, decoded) => {
            if (error) {
                res.sendStatus(403);
            }
            else {
                req.user = decoded;
            }
        })
        next();
    }
    catch (ex) {
        SendResponse(req, res, { error: 'دسترسی مقدور نیست.اطلاعات دستکاری شده است.' }, false,403)
    }
}