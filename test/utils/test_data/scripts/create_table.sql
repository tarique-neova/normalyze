CREATE TABLE Personal_Information (
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    CompanyName VARCHAR(100),
    Address VARCHAR(100),
    City VARCHAR(50),
    County VARCHAR(50),
    PostalCode VARCHAR(10),
    PhoneNumber VARCHAR(20),
    SSNNumber VARCHAR(11),
    EmailAddress VARCHAR(100)
);

CREATE TABLE Financial_Information (
    CustomerName VARCHAR(50),
    CreditCardNumber VARCHAR(16),
    IssuedBank VARCHAR(50),
    CVV VARCHAR(3),
    ExpiryDate VARCHAR(7),
    BankAccountNumber VARCHAR(12)
);
