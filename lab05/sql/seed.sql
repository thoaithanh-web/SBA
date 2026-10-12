USE OrchidManagementDB;
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N'Taichung Beauty')
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N'Taichung Beauty', 0, N'Cattleya sắc tím với cánh hoa mềm mại. Một điểm nhấn rực rỡ trong bộ sưu tập.', N'Cattleya', 1, 'http://localhost:5173/images/hoalan2.jpg');
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N'Dendrobium Sunshine')
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N'Dendrobium Sunshine', 1, N'Dáng hoa thanh thoát, thích ánh sáng dịu và không gian thông thoáng.', N'Dendrobium', 0, 'http://localhost:5173/images/hoalan3.jpg');
IF NOT EXISTS (SELECT 1 FROM dbo.Orchid WHERE OrchidName = N'Hồ điệp trắng')
    INSERT INTO dbo.Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N'Hồ điệp trắng', 0, N'Hoa hồ điệp mang nét thanh lịch, nở bền và phù hợp để trưng bày trong nhà.', N'Phalaenopsis', 1, 'http://localhost:5173/images/hoalan1.jpg');
