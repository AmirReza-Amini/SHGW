const Log = require('../util/Logger')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

module.exports = (req, res, next) => {
    let agent = req.headers['user-agent'];
    let client = { ip: '', os: '', browser: '' }
    client.ip = req.ip;
    client.os = agent.match(new RegExp(/(?<=\().*?(?=;)/))[0];
    let br = agent.split(' ');
    client.browser = br[br.indexOf(br.find(m => m.startsWith('Gecko'))) + 1];

    req.client = client;
    req.body.verb = req.method;
    req.body.url = req.url;
    if (req.headers['authorization']) {
        let decodedUser = jwt.decode(req.headers['authorization'])
        req.body.from = _.pick(decodedUser, ['id', 'lastName', 'firstName', 'contactInfo']);
    } else
        req.body.from = 'anonymous'
    Log({ req: req.body, client: req.client })
    next();
}

GetRoot = (err) => {
    let parts = err.stack.toString()
        .split('\n')[1]
        .replace('(', '')
        .replace(')', '')
        .split('\\');

    return parts[parts.length - 1];
}