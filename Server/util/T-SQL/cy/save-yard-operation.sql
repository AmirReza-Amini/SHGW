EXEC dbo.SP_H_SaveYardOperation @OperatorID = @operatorId, -- int
    @EquipmentID = @equipmentId, -- int
    @UserID = @userId, -- int
    @CntrNo = @cntrNo, -- nvarchar(12)
    @VoyageID = @voyageId, -- bigint
    @CntrLocation = @cntrLocation, -- nvarchar(40)
    @ActID = @actId, -- bigint
    @TruckNo = @truckNo -- nvarchar(50)