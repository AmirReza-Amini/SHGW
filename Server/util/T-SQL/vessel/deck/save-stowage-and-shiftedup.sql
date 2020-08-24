EXEC SP_H_SaveStowageAndShiftedUp @CntrNo = @cntrNo, -- nvarchar(12)
					    @VoyageId = @voyageId, -- bigint
					    @UserID = @userId, -- int
					    @EquipmentId = @equipmentId, -- int
					    @OperatorId = @operatorId, -- int
					    @BayAddress = @bayAddress, -- nvarchar(7)
					    @ActType = @actType -- smallint