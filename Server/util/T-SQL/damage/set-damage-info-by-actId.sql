-- EXEC dbo.sp_SetDamageLetters @ActID = @actId, -- bigint
-- 	    @text = @text, -- nvarchar(20)
-- 	    @side = @side, -- smallint
-- 	    @StaffID = @staffId -- bigint


DECLARE @OutputResult NVARCHAR(MAX);
EXEC SP_H_SetDamgeBasedOnDamageList @DamageList = @damagelist, 
    @OutputResult = @OutputResult OUTPUT 