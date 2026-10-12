IF DB_ID(N'OrchidManagementDB') IS NULL
    CREATE DATABASE OrchidManagementDB;
GO
USE OrchidManagementDB;
GO
SELECT DB_NAME() AS CurrentDatabase;
