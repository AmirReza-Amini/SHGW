SET QUOTED_IDENTIFIER ON
SET ANSI_NULLS ON
GO
-- =============================================
-- Author:		Majid Daryadel
-- Create date: 2/14/2016
-- Description:	Finds Cotainer in BayplanCntr and adds it to Shifting
-- =============================================
CREATE PROCEDURE [dbo].[SP_H_AddToShifting]
    @CntrNo NVARCHAR(12),
    @VoyageId BIGINT,
    @StaffID BIGINT
AS
  BEGIN
    DECLARE @CntrId BIGINT;
    DECLARE @AgentId BIGINT;
    DECLARE @OwnerId BIGINT;
    DECLARE @IsoCode BIGINT;
    DECLARE @IMDGCode NVARCHAR(40);
    DECLARE @FullEmpty SMALLINT;
    DECLARE @POD BIGINT;
    DECLARE @location NVARCHAR(100)
    DECLARE @OutVal BIT=1;

    BEGIN TRY
    BEGIN TRAN
    SET NOCOUNT ON;

    SELECT @location=(CASE WHEN AppLocation=1 THEN 'IRBUZ' ELSE 'IRBND' END) FROM AppPreferences AS AP

    SELECT @POD=P.PortID FROM Ports AS P WHERE P.PortName=@location

    SELECT TOP 1 @FullEmpty=BC.BayCntrFullEmpty,@IMDGCode=BC.BayIMDGCode,@IsoCode=BC.IsoCodeID,@AgentId=VI.ShippingLineID,@OwnerId=VI.Shi_ShippingLineID
    FROM Bayplan AS B
      JOIN BayplanCntrs AS BC ON BC.BayPlanID = B.BayPlanID
      JOIN VoyageInfo AS VI ON VI.VoyageID = B.VoyageID
    WHERE B.VoyageID=@VoyageId AND BC.BayCntrNo=@CntrNo AND ISNULL(BC.PortIDDischarge,0)<>@POD AND B.BayPlanType=1
    ORDER BY B.ReceiveFileDate DESC

    IF @@ROWCOUNT=0
      SET @OutVal=0;
    ELSE
      BEGIN
        SELECT @CntrId=CI.CntrID FROM ContainersInfo AS CI WHERE CI.CntrNo=@CntrNo

        IF @@ROWCOUNT=0
          BEGIN
            INSERT INTO ContainersInfo
            ( CntrNo ,
              ShippingLineID ,
              ConsigneeID ,
              Shi_ShippingLineID ,
              IsoCodeID ,
              ContainerColor ,
              IsStandardCntr ,
              ContainerSymbol
            )
            VALUES  ( @CntrNo , -- CntrNo - nvarchar(12)
                      @AgentId , -- ShippingLineID - bigint
                      NULL , -- ConsigneeID - bigint
                      @OwnerId , -- Shi_ShippingLineID - bigint
                      @IsoCode , -- IsoCodeID - bigint
                      NULL , -- ContainerColor - smallint
                      1 , -- IsStandardCntr - bit
                      NULL  -- ContainerSymbol - nvarchar(8)
            )
            SET @CntrId=CAST(@@IDENTITY AS BIGINT);
          END

        INSERT INTO Shifting
        ( VoyageID ,
          CntrID ,
          CntrNo ,
          TerminalID ,
          StatusDateTime ,
          UserID ,
          IsDeleted ,
          FullEmptyStatus ,
          IMDGCODE,
          TallyManID
        )
        VALUES  ( @VoyageId , -- VoyageID - bigint
                  @CntrId , -- CntrID - bigint
                  @CntrNo , -- CntrNo - nvarchar(12)
                  NULL , -- TerminalID - bigint
                  GETDATE() , -- StatusDateTime - datetime
                  NULL , -- UserID - bigint
                  0 , -- IsDeleted - bit
                  @FullEmpty , -- FullEmptyStatus - smallint
                  @IMDGCode,  -- IMDGCODE - nvarchar(40)
                  @StaffID
        )
      END
    COMMIT TRAN
    END TRY

    BEGIN CATCH
    ROLLBACK
    SET @OutVal=0;
    END CATCH

    SELECT @OutVal AS Result;
  END
GO

