SELECT P.StaffID ,
       P.StaffCode ,
       (P.StaffFirstName + ' ' + P.StaffLastName) AS Name  FROM dbo.Personnels AS P
WHERE P.StaffCode=@Code