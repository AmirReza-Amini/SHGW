const Log = require('./Logger');
const r = require('redis')
const redis = r.createClient();

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

    Log({ type: result ? 'info' : 'error', res: req.body })
    res.status(code).json(
        Object.assign(req.base, {
            result: result,
            data: Array.isArray(data) ? data : [data]
        }))
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

module.exports = {
    Map: map,
    SendResponse: sendResponse,
    ConnectionString: {
        Build: buildConnectionString,
        Get: getConnectionString
    }
}