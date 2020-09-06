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
    jwtExpireTime: 3000,
    tokenHashKey: 'YOUR_TOKEN_HASH_KEY',
    jwtSecret: "YOUR_JWT_SECRET_KEY"


}
