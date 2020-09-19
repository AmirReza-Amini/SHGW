
const setting = require('../app-setting');
const sql = require('mssql');

let sqlConfig = {};
sqlConfig = {
    options: {
        enableArithAbort: true
    }
};
sqlConfig = { ...sqlConfig, ...setting.db.sqlConfig.config };
//console.log(sqlConfig)
const pool = new sql.ConnectionPool(sqlConfig);
pool.connect(error => {
    if (error)
        console.log('Can not connect to sql server with mssql library', error);
});

pool.on('error', err => {
    if (err)
        console.log('Can not listen to msssql pool connection', err);
})

sql.pool = pool;
module.exports = pool;