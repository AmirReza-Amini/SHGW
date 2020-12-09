SET QUOTED_IDENTIFIER ON
SET ANSI_NULLS ON
GO
-- =============================================
-- Author:		Majid Daryadel
-- Create date: 2/16/2017
-- Description:	Updates and Inserts DamageDetails and DamageLog for an ActID by side damage texts
-- =============================================
CREATE PROCEDURE SP_H_SetDamageInfo
    @ActID BIGINT ,
    @text NVARCHAR(20) ,
    @side SMALLINT ,
    @StaffID BIGINT ,
    @Result BIT OUT ,
    @Message NVARCHAR(2048) OUT
AS
    BEGIN
	--DECLARE @Message NVARCHAR(2048)='OK';
	--DECLARE @Result BIT=1;
        SET @Message = 'OK';
        SET @Result = 1;
        BEGIN TRY
            BEGIN TRAN;
            SET NOCOUNT ON;

            IF @side = 7
                SET @side = 0;
			
            DECLARE @i SMALLINT= 1;
            DECLARE @VoyageID BIGINT= ( SELECT  VoyageID
                                        FROM    ActCntr
                                        WHERE   ActID = @ActID
                                      );
            DECLARE @CntrID BIGINT= ( SELECT    CntrID
                                      FROM      ActCntr
                                      WHERE     ActID = @ActID
                                    ); 
            DECLARE @DamageID BIGINT= ( SELECT  DamageID
                                        FROM    Damage
                                        WHERE   ActID = @ActID
                                                AND IsDeleted = 0
                                      ); 

            IF @DamageID IS NULL
                AND @ActID IS NOT NULL
                BEGIN
                    INSERT  INTO Damage
                            ( ActID ,
                              StatusDateTime ,
                              ModifiedDateTime ,
                              IsDeleted
				            )
                    VALUES  ( @ActID , -- ActID - bigint
                              GETDATE() , -- StatusDateTime - datetime
                              NULL , -- ModifiedDateTime - datetime
                              0  -- IsDeleted - bit
				            );
                    SET @DamageID = CAST(@@IDENTITY AS BIGINT);
                END;

            WHILE @i <= LEN(ISNULL(@text, ''))
                BEGIN
                    DECLARE @letter CHAR(1)= SUBSTRING(@text, @i, 1);
                    DECLARE @defid BIGINT;
                    DECLARE @issided BIT;
                    SELECT  @defid = DefinitionID ,
                            @issided = IsSided
                    FROM    DamageDefinition
                    WHERE   Letter = @letter;
				
                    IF @defid IS NOT NULL
                        AND ( ( @side > 0
                                AND @issided = 1
                                AND @side < 7
                              )
                              OR ( @side = 0
                                   AND @issided = 0
                                 )
                            )
                        BEGIN
                            DECLARE @RC INT= ( SELECT   COUNT(*)
                                               FROM     DamageDetail AS DD
                                                        JOIN DamageDefinition
                                                        AS DD2 ON DD2.DefinitionID = DD.DefinitionID
                                               WHERE    DD.DamageID = @DamageID
                                                        AND DD2.Letter = @letter
                                                        AND DD.IsDeleted = 0
                                                        AND DD.Side = @side
                                             );

                            IF @RC = 0
                                BEGIN
                                    INSERT  INTO DamageDetail
                                            ( DamageID ,
                                              DefinitionID ,
                                              Side ,
                                              StatusDateTime ,
                                              ModifiedDateTime ,
                                              StaffID ,
                                              UserID ,
                                              IsDeleted
						                    )
                                    VALUES  ( @DamageID , -- DamageID - bigint
                                              @defid , -- DefinitionID - bigint
                                              @side , -- Side - tinyint
                                              GETDATE() , -- StatusDateTime - datetime
                                              NULL , -- ModifiedDateTime - datetime
                                              @StaffID , -- StaffID - bigint
                                              NULL , -- UserID - bigint
                                              0  -- IsDeleted - bit
						                    );

                                    DECLARE @DetailID BIGINT= CAST(@@IDENTITY AS BIGINT);																				
                                    SET @RC = ( SELECT  COUNT(*)
                                                FROM    DamageLog AS DL
                                                        JOIN DamageDetail AS DD ON DD.DetailID = DL.DetailID
                                                WHERE   DL.VoyageID = @VoyageID
                                                        AND DL.CntrID = @CntrID
                                                        AND DD.Side = @side
                                                        AND DD.DefinitionID = @defid
                                                        AND DD.IsDeleted = 0
                                              );

                                    IF @RC = 0
                                        INSERT  INTO DamageLog
                                                ( VoyageID, CntrID, DetailID )
                                        VALUES  ( @VoyageID, -- VoyageID - bigint
                                                  @CntrID, -- CntrID - bigint
                                                  @DetailID  -- DetailID - bigint
                                                  );
                                END;	
                        END; 

                    SET @i = @i + 1;
                END;
            IF ( @@TRANCOUNT > 0 )
                COMMIT TRAN;
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT = 1
                BEGIN
                    ROLLBACK;
                    SET @Message = 'Error: ' + ERROR_MESSAGE();
                    SET @Result = 0;
                END;
            ELSE
                IF @@TRANCOUNT > 1
				BEGIN
				SET @Message = 'Error: ' + ERROR_MESSAGE();
                    SET @Result = 0;
                    COMMIT;
				END
                  
        END CATCH;
    END;






GO

