USE ${database_name};

CREATE TABLE PersonalData (
    FullName NVARCHAR(100),
    MaidenName NVARCHAR(100),
    MothersMaidenName NVARCHAR(100),
    HomeAddress NVARCHAR(255),
    WorkAddress NVARCHAR(255),
    EmailAddress NVARCHAR(100),
    PhoneNumber NVARCHAR(15),
    SSN NVARCHAR(11),
    PassportNumber NVARCHAR(20),
    DriversLicenseNumber NVARCHAR(20),
    BirthDate DATE,
    Gender NVARCHAR(10)
);

INSERT INTO PersonalData (FullName, MaidenName, MothersMaidenName, HomeAddress, WorkAddress, EmailAddress, PhoneNumber, SSN, PassportNumber, DriversLicenseNumber, BirthDate, Gender)
VALUES
('John Doe', 'Smith', 'Jane Smith', '123 Home St', '456 Work Ave', 'john.doe@example.com', '123-456-7890', '123-45-6789', 'A1234567', 'D1234567', '1980-01-01', 'Male'),
('Jane Doe', 'Johnson', 'Mary Johnson', '789 Home St', '123 Work Ave', 'jane.doe@example.com', '987-654-3210', '987-65-4321', 'B7654321', 'E7654321', '1990-02-02', 'Female');

