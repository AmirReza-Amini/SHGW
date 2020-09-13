
const setting = require('../app-setting');
const sql = require('mssql');

const pool = new sql.ConnectionPool(setting.db.sqlConfig.config);
pool.connect(error => {
    console.log('error sql connection damage', error);
});

pool.on('error', err => {
    console.log('error sql on damage', err);
})

sql.pool = pool;
module.exports = pool;