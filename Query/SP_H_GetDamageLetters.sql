SET QUOTED_IDENTIFIER ON
SET ANSI_NULLS ON
GO
-- =============================================
-- Author:		Majid Daryadel
-- Create date: 2/15/2017
-- Description:	Returns 7 strings each one containing damage letters of one side for an ActID
-- =============================================
CREATE PROCEDURE SP_H_GetDamageLetters
	@ActID BIGINT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Dtexts TABLE(Side SMALLINT,Letters NVARCHAR(20));
	DECLARE @sides SMALLINT=1;
	DECLARE @side SMALLINT;
	DECLARE @letter NVARCHAR(1);

	WHILE @sides<8
	BEGIN
		INSERT INTO @Dtexts
		        ( Side, Letters )
		VALUES  ( @sides, -- side - smallint
		          NULL  -- Letters - nvarchar(20)
		          )
		SET @sides=@sides+1;
	END

	IF @ActID IS NOT NULL AND 
	(SELECT D.DamageID FROM Damage AS D WHERE D.ActID=@ActID) IS NOT NULL
	BEGIN
	    	DECLARE Details CURSOR FOR 
			SELECT CASE WHEN DD.Side=0 THEN 7 ELSE DD.Side END,DD2.Letter FROM Damage AS D
			JOIN DamageDetail AS DD ON DD.DamageID = D.DamageID
			JOIN DamageDefinition AS DD2 ON DD2.DefinitionID = DD.DefinitionID
			WHERE D.ActID=@ActID AND DD.IsDeleted=0

		OPEN Details FETCH NEXT FROM Details INTO @side,@letter

		WHILE @@FETCH_STATUS=0 
		BEGIN	
	    UPDATE @Dtexts SET Letters=REPLACE(ISNULL(Letters,'')+@letter,' ','') WHERE side=@side
		
			FETCH NEXT 
			FROM Details 
			INTO @side,@letter
		END

		CLOSE Details   
		DEALLOCATE Details
	END

	SELECT * FROM @Dtexts
END

GO

