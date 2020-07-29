
EXEC dbo.sp_SaveUnloadIncrement 
	    @CntrNo = @cntrNo, -- nvarchar(12)
	    @VoyageId = @voyageId, -- bigint
	    @BerthID = @berthId, -- bigint
	    @UserID = @userId, -- int
	    @EquipmentId = @equipmentId, -- int
	    @OperatorId = @operatorId, -- int
	    @TerminalID = @terminalId, -- bigint
	    @Vehicle = @truckNo, -- nvarchar(15)
	    @SE = @sE, -- bit
	    @OG = @oG -- bit