SELECT TOP 1 ILC.LoadingCntrID FROM dbo.InstructionLoading AS IL
INNER JOIN dbo.InstructionLoadingCntrs AS ILC ON ILC.LoadingInstructionID = IL.LoadingInstructionID
WHERE ILC.CntrNo=@cntrNo AND IL.VoyageID = @voyageId AND ILC.IsDeleted <> 1