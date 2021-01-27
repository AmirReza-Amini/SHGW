const { LoadText } = require('../utility')


module.exports = {
    USER: {
        getAllUsersFromBcts: LoadText(__dirname + '/user/get-all-users-from-bcts.sql')
    },
    VOYAGE: {
        loadLastVoyages: LoadText(__dirname + '/voyage/load-last-voyages.sql'),
        getLoadUnloadStatisticsByVoyageId: LoadText(__dirname + '/voyage/get-load-unload-statistics-by-voyageid.sql')
    },
    EQUIPMENT: {
        getEquipments: LoadText(__dirname + '/equipment/get-equipments.sql')
    },
    OPERATOR: {
        getOperatorInfoBasedOnCode: LoadText(__dirname + '/operator/get-operator-info-based-on-code.sql')
    },
    VESSEL: {
        BERTH: {
            getCntrInfoForUnload: LoadText(__dirname + '/vessel/berth/get-cntr-info-for-unload.sql'),
            saveUnload: LoadText(__dirname + '/vessel/berth/save-unload.sql'),
            addToShifting: LoadText(__dirname + '/vessel/berth/add-to-shifting.sql'),
            addToLoadingList: LoadText(__dirname + '/vessel/berth/add-to-loading-list.sql'),
            isExistCntrInInstructionLoading: LoadText(__dirname + '/vessel/berth/is-exist-cntr-in-instruction-loading.sql'),
            saveUnloadIncrement: LoadText(__dirname + '/vessel/berth/save-unload-increment.sql'),
            saveUnloadIncrementWithoutBayplanAndManifest: LoadText(__dirname + '/vessel/berth/save-unload-increment-without-bayplan-and-manifest.sql'),
            getCntrInfoForLoad: LoadText(__dirname + '/vessel/berth/get-cntr-info-for-load.sql'),
            saveLoad: LoadText(__dirname + '/vessel/berth/save-load.sql')
        },
        DECK: {
            getCntrInfoForStowage: LoadText(__dirname + '/vessel/deck/get-cntr-info-for-stowage.sql'),
            getStowageInfoForCntrByVoyage: LoadText(__dirname + '/vessel/deck/get-stowage-info-for-cntr-by-voyage.sql'),
            isOccoupiedBayAddressInVoyage: LoadText(__dirname + '/vessel/deck/is-occoupied-bay-address-in-voyage.sql'),
            saveStowageAndShiftedup: LoadText(__dirname + '/vessel/deck/save-stowage-and-shiftedup.sql'),
            getHatchOperationTypes: LoadText(__dirname + '/vessel/deck/get-hatch-operation-types.sql'),
            getHatchDirection: LoadText(__dirname + '/vessel/deck/get-hatch-directions.sql'),
            saveVesselHatchInfo: LoadText(__dirname + '/vessel/deck/save-vessel-hatch-info.sql'),
            getVesselHatchInfoByVoyage: LoadText(__dirname + '/vessel/deck/get-vessel-hatch-info-by-voyage.sql')
        }
    },
    CY: {
        YARDOPERATION: {
            getCntrInfoForYardOperation: LoadText(__dirname + '/cy/get-cntr-info-for-yard-operation.sql'),
            saveYardOperation: LoadText(__dirname + '/cy/save-yard-operation.sql')
        },
        MOVEMENT: {
            getCntrInfoForMovement: LoadText(__dirname + '/cy/movement/get-cntr-info-for-movement.sql'),
            isDuplicateYardCodeByCntrNoInVoyage: LoadText(__dirname + '/cy/movement/is-duplicate-yard-code-by-cntrNo-in-voyage.sql'),
            saveMovement: LoadText(__dirname + '/cy/movement/save-movement.sql')
        },
        SEND: {
            isAlreadySentCntrNoByOperatorInVoyage: LoadText(__dirname + '/cy/send/is-already-sent-cntrNo-by-operator-in-voyage.sql'),
            saveSend: LoadText(__dirname + '/cy/send/save-send.sql')
        }

    },
    DAMAGE: {
        getDamageDefinition: LoadText(__dirname + '/damage/get-damage-definition.sql'),
        getDamageInfoByActId: LoadText(__dirname + '/damage/get-damage-info-by-actId.sql'),
        setDamageInfoByActId: LoadText(__dirname + '/damage/set-damage-info-by-actId.sql')
    },
    ACT: {
        isPossibleSaveAct: LoadText(__dirname + '/act/is-possible-save-act.sql')
    }
}