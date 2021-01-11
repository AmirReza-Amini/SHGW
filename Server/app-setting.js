module.exports = {
    portNo: 4001,
    db: {
        mongo: {
            main: {
                name: 'SHGW',
                address: 'localhost:27017'
            },
            log: {
                name: 'SHGW-log',
                address: 'localhost:27017'
            }
        },
        sqlConfig: {
            driver: 'mssql',
            config: {
                user: 'sa',
                password: 'qwe123!@#',
                server: '172.17.30.2\\mssqlserver2016',
                database: 'ZBR',
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 60000
                }
            }
        }
    },
    jwtExpireTime: 3000,
    tokenHashKey: '8c10%$#f9be0b053082',
    requiresAuth: true,
    jwtSecret: "9057c4f0-b57e-4320-9a7e-c028bc3e54cb"
}
