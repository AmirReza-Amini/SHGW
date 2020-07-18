const Log = require('../models/log.model')

module.exports = async (data, logToConsole = false) => {
    let log = Log();
    log.type = data.type || 'info';
    log.root = data.root || 'server';
    log.message = data.message;
    log.req = data.req;
    log.res = data.res;
    log.client = data.client;
    try {
        if (logToConsole)
            console.log(`LOGGER --- ${new Date()}| `, req);
        await log.save();
    }
    catch (ex) {
        console.log(ex);
    }
}