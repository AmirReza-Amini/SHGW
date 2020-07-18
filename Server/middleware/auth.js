const { tokenHashKey, jwtSecret } = require('../app-setting')
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const CryptoJs = require('crypto-js');

module.exports = async (req, res, next) => {

    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) return res.sendStatus(401).send('Access denied. No token provided');
    try {
        let encryptedToken = bearerHeader.split(' ')[1].replace(/['"]+/g, '');
        let token = AES.decrypt(encryptedToken, tokenHashKey).toString(CryptoJs.enc.Utf8)

        jwt.verify(token, jwtSecret, async (error, authData) => {
            if (error) {
                res.sendStatus(403);
            }
            else {
                req.tokenDecoded = authData;
            }
        })
        next();
    }
    catch (ex) {
        res.status(403).send(ex);
    }
}