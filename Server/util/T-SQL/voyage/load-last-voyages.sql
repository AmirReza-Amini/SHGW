
SELECT HVI.VoyageID ,
       HVI.VoyageNo ,
       HVI.VoyageDesc ,
       HVI.VoyageStatus ,
       HVI.VoyageType ,
       HVI.BerthID ,
       HVI.BerthName ,
       HVI.POL ,
       HVI.POD ,
       HVI.ShipName FROM dbo.H_VoyageInfo AS HVI
WHERE HVI.VoyageStatus = 1 AND HVI.BerthID IS NOT NULL
