DECLARE @Location NVARCHAR(50) = '';
DECLARE @AdminUserID BIGINT = 0;

SELECT @AdminUserID = P.StaffID FROM dbo.Personnels AS P WHERE P.StaffCode = 'administrator'
SELECT @location=(CASE AppLocation WHEN 0 THEN 'BND' WHEN 1 THEN 'BUZ' ELSE 'ZBR' END) FROM AppPreferences AS AP

SELECT 
	   P.StaffID AS userId,
       P.StaffCode AS userCode,
       P.StaffFirstName AS firstName,
       P.StaffLastName AS lastName,
       P.StaffIsActive AS isActive,
       P.StaffPassword AS [password],
	   CASE P.StaffID WHEN @AdminUserID THEN 'Superuser' ELSE 'Default' END AS userType,
	   @Location AS area
	   FROM dbo.Personnels AS P
WHERE P.StaffPassword IS NOT NULL AND LEN(REPLACE(P.StaffPassword,' ','')) > 0
ORDER BY P.StaffCode