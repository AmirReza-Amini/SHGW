
SELECT TOP 10 VI.VoyageID,VI.VoyageNo,S.ShipName FROM dbo.VoyageInfo AS VI
INNER JOIN dbo.SeaVoyageInfo AS SVI ON SVI.SeaVoyageID = VI.SeaVoyageID
INNER JOIN dbo.Ships AS S ON S.ShipID = SVI.ShipID
WHERE VI.VoyageStatus=1
ORDER BY VI.VoyageID DESC