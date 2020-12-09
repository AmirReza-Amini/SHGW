SET QUOTED_IDENTIFIER ON
SET ANSI_NULLS ON
GO
-- =============================================
-- Author:		Majid Daryadel
-- Create date: 1/4/2016
-- Description:	Adds a shifting Container to InstructionLoading and InstructionLoadingCntr
-- =============================================
CREATE PROCEDURE SP_H_AddToLoadList
	@CntrNo NVARCHAR(12),
	@VoyageID INT
AS
BEGIN
	DECLARE @owner BIGINT;
	DECLARE @agent BIGINT;	
	DECLARE @PortID BIGINT;	
	DECLARE @PoDischarge NVARCHAR(100);	
	DECLARE @PoDestination NVARCHAR(100);	
	DECLARE @LoadingInstructionID BIGINT;	
	DECLARE @CIMDGCode NVARCHAR(100);
	DECLARE @FullEmptyStatus SMALLINT;
	DECLARE @Weight DECIMAL;
	DECLARE @LoadingInstructionNo NVARCHAR(12);
	DECLARE @Year NVARCHAR(4)=dbo.Fn_ConvertToSolarDate(GetDate(),2);
	DECLARE @MaxNo NVARCHAR(8);
	DECLARE @Output AS BIT=1;
	DECLARE @UN NVARCHAR(100);
	DECLARE @SetP FLOAT;

	BEGIN TRY 
		BEGIN TRAN
			SET NOCOUNT ON;
			
			SET @MaxNo=(select MAX(CAST(ISNULL(right(LoadingInstrucionNo,8),'0') AS BIGINT))+1 FROM InstructionLoading Where SubString(LoadingInstrucionNo,1,4)=@Year);
			SET @LoadingInstructionNo=@Year+SUBSTRING('00000000',1,8-LEN(@MaxNo))+@MaxNo;
						
			SELECT @FullEmptyStatus=BC.BayCntrFullEmpty,@agent=CI.ShippingLineID,@owner=CI.Shi_ShippingLineID,@Weight=BC.BayCntrWeight,@CIMDGCode=BC.BayIMDGCode,
			@PortID=BC.PortIDDestination,@PoDischarge=BC.PortOfDischarge,@UN=BC.UNnumber,@SetP=BC.SetPoint,@PoDestination=BC.PortOfDestination
			FROM Bayplan AS B 
			JOIN BayplanCntrs AS BC ON BC.BayPlanID = B.BayPlanID
			JOIN ContainersInfo AS CI ON CI.CntrNo = BC.BayCntrNo
			WHERE BC.BayCntrNo=@CntrNo AND B.VoyageID=@VoyageID AND B.BayPlanType=1

			SELECT TOP 1 @LoadingInstructionID=IL.LoadingInstructionID FROM InstructionLoading AS IL 
			WHERE IL.ShippingLineID=@agent AND IL.Shi_ShippingLineID=@owner AND IL.VoyageID=@VoyageID AND IL.BLType=10

			IF @@ROWCOUNT=0
			BEGIN
				INSERT INTO InstructionLoading
						( VoyageID ,
						  LoadingInstrucionNo ,
						  LoadingInstructionDate ,
						  LoadingDate ,
						  LoadingInstrucionDescription ,
						  LoadingInstructionStatus ,
						  ShippingLineID ,
						  Shi_ShippingLineID ,
						  BLNO ,
						  BLType
						)
				VALUES  ( @VoyageID , -- VoyageID - bigint
						  @LoadingInstructionNo , -- LoadingInstrucionNo - nvarchar(30)
						  GETDATE() , -- LoadingInstructionDate - datetime
						  GETDATE() , -- LoadingDate - datetime
						  N'Shifting' , -- LoadingInstrucionDescription - nvarchar(510)
						  0 , -- LoadingInstructionStatus - smallint
						  @agent , -- ShippingLineID - bigint
						  @owner , -- Shi_ShippingLineID - bigint
						  NULL , -- BLNO - nvarchar(200)
						  10  -- BLType - smallint
						)

				SET @LoadingInstructionID=CAST(@@IDENTITY AS BIGINT);
			END
            
			INSERT INTO InstructionLoadingCntrs
					( PortID ,
					  LoadingInstructionID ,
					  ActID ,
					  CntrNo ,
					  CntrWeight ,
					  POD ,
					  POT ,
					  GrossWeight ,
					  CommodityType ,
					  CommodityDescription ,
					  CustomPermissionNumber ,
					  CustomPermissionDate ,
					  SealNumber ,
					  SetPoint ,
					  Humidity ,
					  UNnumber ,
					  CIMDGCode ,
					  FlashPoint ,
					  FullEmptyStatus ,
					  TareWeight ,
					  PortOfDestination ,
					  AreaID ,
					  IsDeleted
					)
			VALUES  ( @PortID , -- PortID - bigint
					  @LoadingInstructionID , -- LoadingInstructionID - bigint
					  NULL , -- ActID - bigint
					  @CntrNo , -- CntrNo - nvarchar(12)
					  @Weight , -- CntrWeight - decimal
					  @PoDischarge , -- POD - nvarchar(4000)
					  NULL , -- POT - nvarchar(4000)
					  @Weight , -- GrossWeight - decimal
					  NULL , -- CommodityType - nvarchar(4000)
					  NULL , -- CommodityDescription - nvarchar(4000)
					  NULL , -- CustomPermissionNumber - nvarchar(4000)
					  NULL , -- CustomPermissionDate - datetime
					  NULL , -- SealNumber - nvarchar(4000)
					  @SetP , -- SetPoint - float
					  NULL , -- Humidity - float
					  @UN , -- UNnumber - nvarchar(4000)
					  @CIMDGCode , -- CIMDGCode - nvarchar(4000)
					  NULL , -- FlashPoint - float
					  @FullEmptyStatus , -- FullEmptyStatus - smallint
					  @Weight , -- TareWeight - decimal
					  @PoDestination , -- PortOfDestination - nvarchar(4000)
					  NULL , -- AreaID - bigint
					  0  -- IsDeleted - bit
					)	
					
		COMMIT TRAN
    END TRY

	BEGIN CATCH
		ROLLBACK
		SET @Output=0;
	END CATCH

	SELECT @Output AS Result
END
GO

