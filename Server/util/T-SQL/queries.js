const { LoadText } = require('../utility')


module.exports = {
    VOYAGE: {
        loadLastVoyages: LoadText(__dirname + '/voyage/load-last-voyages.sql'),
    },
    EQUIPMENT:{
        fetchEquipmentsForLoadUnload:LoadText(__dirname + '/equipment/fetch-equipments-for-load-unload.sql')
    },
    OPERATOR:{
        fetchOperatorInfoBasedOnCode:LoadText(__dirname +'/operator/fetch-operator-info-based-on-code.sql')
    },
    VESSEL:{
        BERTH:{
            getCntrInfoForUnload:LoadText(__dirname + '/vessel/berth/get-cntr-info-for-unload.sql'),
            saveUnload:LoadText(__dirname + '/vessel/berth/save-unload.sql'),
            addToShifting:LoadText(__dirname+'/vessel/berth/add-to-shifting.sql'),
            addToLoadingList:LoadText(__dirname+'/vessel/berth/add-to-loading-list.sql'),
            isExistCntrInInstructionLoading:LoadText(__dirname+'/vessel/berth/is-exist-cntr-in-instruction-loading.sql'),
            saveUnloadIncrement:LoadText(__dirname+'/vessel/berth/save-unload-increment.sql'),

            getCntrInfoForLoad:LoadText(__dirname + '/vessel/berth/get-cntr-info-for-load.sql'),
            saveLoad:LoadText(__dirname+'/vessel/berth/save-load.sql'),
        },
        DECK:{

        }
    },
    DAMAGE:{
        fetchDamageDefinition:LoadText(__dirname+'/damage/fetch-damage-definition.sql'),
        getDamageInfoByActId:LoadText(__dirname+'/damage/get-damage-info-by-actId.sql'),
        setDamageInfoByActId:LoadText(__dirname+'/damage/set-damage-info-by-actId.sql')
    }

}