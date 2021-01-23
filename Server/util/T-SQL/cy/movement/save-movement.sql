
EXEC dbo.SP_H_SaveMovement
	    @VoyageId = @voyageId, -- bigint
        @CntrNo = @cntrNo, -- nvarchar(12)
        @CntrLocation = @cntrLocation,
        @FullEmptyStatus = @fullEmptyStatus,
        @CntrId = @cntrId,
	    @AgentId = @agentId, -- bigint
	    @OwnerId = @ownerId, -- int
	    @TerminalId = @terminalId, -- bigint
        @OperatorId = @operatorId, -- int
        @EquipmentId = @equipmentId, -- int
        @UserId = @userId