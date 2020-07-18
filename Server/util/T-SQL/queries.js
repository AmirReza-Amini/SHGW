const { LoadText } = require('../utility')


module.exports = {
    VOYAGE: {
        loadLastVoyages: LoadText(__dirname + '/voyage/load-last-voyages.sql'),
    }
}