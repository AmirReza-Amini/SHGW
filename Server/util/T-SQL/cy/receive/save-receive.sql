EXEC dbo.SP_H_SaveReceive
    @VoyageId = @voyageId, -- bigint
    @CntrNo = @cntrNo, -- nvarchar(12)
    @CntrLocation = @cntrLocation, -- nvarchar(40)
    @ActID = @actId, -- bigint
    @OperatorId = @operatorId, -- int
    @EquipmentId = @equipmentId, -- int
    @TruckNo = @truckNo, -- nvarchar(30)
    @UserId = @userId -- int