const { LoadText } = require('../utility')


module.exports = {
    VOYAGE: {
        loadLastVoyages: LoadText(__dirname + '/voyage/load-last-voyages.sql'),
    },
    EQUIPMENT:{
        fetchEquipmentsForUnload:LoadText(__dirname + '/equipment/fetch-equipments-for-unload.sql')
    },
    OPERATOR:{
        fetchOperatorInfoBasedOnCode:LoadText(__dirname +'/operator/fetch-operator-info-based-on-code.sql')
    },
    VESSEL:{
        BERTH:{
            getCntrInfoForUnload:LoadText(__dirname + '/vessel/berth/get-cntr-info-for-unload.sql')
        },
        DECK:{

        }
    }

}