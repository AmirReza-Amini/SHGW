SET QUOTED_IDENTIFIER ON
SET ANSI_NULLS ON
GO



---------------Create Procedure---------------

CREATE PROCEDURE SP_H_SetDamgeBasedOnDamageList
    @DamageList DamageInfo READONLY,
	@OutputResult nvarchar(Max) output
AS
    BEGIN
--============================================================================================
        
		DECLARE @ResultTemp ResultInfo ;
        BEGIN TRY
        
            BEGIN TRANSACTION ;
            
            
            DECLARE Cur CURSOR
            FOR
                SELECT  ActID ,
                        Letters ,
                        Side ,
                        StaffID
                FROM    @DamageList; 

            DECLARE @TempActID BIGINT ,
                @TempLetters NVARCHAR(20) ,
                @TempSide SMALLINT ,
                @TempStaffID BIGINT;
            OPEN Cur; 
            FETCH NEXT FROM Cur INTO @TempActID, @TempLetters, @TempSide,
                @TempStaffID;

            WHILE ( @@FETCH_STATUS = 0 )
                BEGIN
                    DECLARE @Result BIT ,
                        @Message NVARCHAR(2048);
                    EXEC SP_H_SetDamageInfo @ActID = @TempActID, -- bigint
                        @text = @TempLetters, -- nvarchar(20)
                        @side = @TempSide, -- smallint
                        @StaffID = @TempStaffID, -- bigint
                        @Result = @Result OUTPUT, -- bit
                        @Message = @Message OUTPUT; -- nvarchar(2048)
					
                    INSERT  INTO @ResultTemp
                            ( Result, Message, ID )
                    VALUES  ( @Result, -- Result - bit
                              @Message, -- Message - nvarchar(2048)
                              @TempSide  -- ID - smallint
                              );
                    FETCH NEXT FROM Cur INTO @TempActID, @TempLetters,
                        @TempSide, @TempStaffID;
                END;

            CLOSE Cur; 
            DEALLOCATE Cur;

            COMMIT ;	
				
        END TRY
        BEGIN CATCH

            ROLLBACK;

			Set @OutputResult= ERROR_MESSAGE();
			SELECT * FROM @ResultTemp AS RT;
  
        END CATCH;

		SELECT * FROM @ResultTemp AS RT;

    END;





GO

