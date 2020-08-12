EXEC dbo.sp_SetDamageLetters @ActID = @actId, -- bigint
	    @text = @text, -- nvarchar(20)
	    @side = @side, -- smallint
	    @StaffID = @staffId -- bigint