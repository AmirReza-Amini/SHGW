SELECT TOP 1 * FROM dbo.HandheldLog AS HL
WHERE 
HL.CntrNo = @cntrNo AND 
HL.Operation = 'Send' AND
HL.OperatorId = @operatorId AND 
HL.EQId = @equipmentId AND
HL.VoyageId = @voyageId