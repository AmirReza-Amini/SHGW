const Log = require('../util/Logger')
const jwt = require('jsonwebtoken')
const { tokenHashKey } = require('../app-setting')
const AES = require('crypto-js/aes');
const CryptoJs = require('crypto-js');

module.exports = async (err, req, res, next) => {
    req.body.verb = req.method;
    req.body.url = req.url;

    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        try {
            let encryptedToken = bearerHeader.split(' ')[1].replace(/['"]+/g, '');
            let token = AES.decrypt(encryptedToken, tokenHashKey).toString(CryptoJs.enc.Utf8)
            let user = jwt.decode(token)
            delete user.accessLevel;
            delete user.iat;
            delete user.exp;
            req.body.from = user;
        }
        catch{ }
    } else
        req.body.from = 'anonymous'

    if (err) {
        await Log({
            type: 'error',
            root: GetRoot(err) || '---',
            message: {
                title: err.message || '504 internal server error',
                detail: err.stack
            },
            req: req.body
        })
    }
    // res.status(500).send('Internal Server ERROR...');;
}

GetRoot = (err) => {
    let parts = err.stack.toString()
        .split('\n')[1]
        .replace('(', '')
        .replace(')', '')
        .split('\\');

    return parts[parts.length - 1];
}