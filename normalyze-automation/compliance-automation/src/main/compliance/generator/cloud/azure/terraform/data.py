import pyodbc

# Replace with your actual database connection details
server = "neovaautotest.database.windows.net"
database = "normalyze_poc"
username = "neova-test"
password = "Normalyze#12345"
driver = "{ODBC Driver 17 for SQL Server}"

# Connect to the database
conn_str = f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}"
conn = pyodbc.connect(conn_str)

# Insert data into the table
cursor = conn.cursor()
insert_query = """
    INSERT INTO YourTableName (FirstName, LastName, Address, PhoneNumber, Email)
    VALUES (?, ?, ?, ?, ?)
"""

data = ("ABC", "XYZ", "Pune", "1234567890", "abc@gmail.com")
cursor.execute(insert_query, data)
conn.commit()

print("Data inserted successfully!")

# Clean up
cursor.close()
conn.close()
