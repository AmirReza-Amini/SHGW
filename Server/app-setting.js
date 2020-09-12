module.exports = {
    portNo: 4000,
    db: {
        mongo: {
            main: {
                name: 'SHGW',
                address: 'localhost:27017'
            },
            log: {
                name: 'Hand-Held-Gate-Way-log',
                address: 'localhost:27017'
            }
        },
        sqlConfig: {
            driver: 'mssql',
            config: {
                user: 'handheld',
                password: 'H@nd!#($',
                server: '192.168.6.42',
                database: 'Shrct',
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 60000
                }
            }
        }
    },
    jwtExpireTime: 300,
    tokenHashKey: '8c10%$#f9be0b053082',
    requiresAuth: true,
    jwtSecret: "9057c4f0-b57e-4320-9a7e-c028bc3e54cb"


}
