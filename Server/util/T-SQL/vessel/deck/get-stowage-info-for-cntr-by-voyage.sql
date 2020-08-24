SELECT  AC.VoyageID ,
        AC.ActID ,
        AC.CntrNo ,
        EEC.LoadingBayAddress ,
        EEC.DeliverID ,
        AC.ACTType ,
        HL.Operation
FROM    ActCntr AS AC
        INNER JOIN EnterExitCntr AS EEC ON EEC.ActID = AC.ActID
        LEFT JOIN HandheldLog AS HL ON HL.ActId = AC.ActID
                                       AND HL.Operation IN ( 'Stowage',
                                                             'Shifted Up' )
WHERE   AC.ACTType IN ( 3, 16 )
        AND AC.VoyageID = @voyageId
        AND AC.CntrNo = @cntrNo;