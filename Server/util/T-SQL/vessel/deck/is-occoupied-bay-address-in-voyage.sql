SELECT TOP 1 * FROM H_EnterExitCntr AS HEEC
WHERE HEEC.VoyageID=@voyageId AND HEEC.LoadingBayAddress=@loadingBayAddress