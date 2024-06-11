import pyodbc
import json


def get_random_value():
    try:
        with open("random_value.txt", "r") as file:
            random_value_dict = json.load(file)
        return random_value_dict.get("value", "")
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading or parsing the random value file: {e}")
        return ""


random_value = get_random_value()

if random_value:
    server = f"{random_value}.database.windows.net"
    database = random_value
    username = 'neova-test'
    password = 'Normalyze#12345'
    driver = '{ODBC Driver 17 for SQL Server}'

    print(f"Connecting to server: {server}")
    print(f"Using database: {database}")

    conn_str = f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}"

    try:
        with pyodbc.connect(conn_str, timeout=10) as conn:
            cursor = conn.cursor()

            # Drop the table if it already exists
            cursor.execute('''
            IF OBJECT_ID('Personal_Information', 'U') IS NOT NULL 
                DROP TABLE Personal_Information;
            ''')
            conn.commit()

            # Create the table using SQL file
            with open('../../utils/scripts/sql/create_personal_info_table.sql', 'r') as create_table_file:
                create_table_sql = create_table_file.read()

            cursor.execute(create_table_sql)
            conn.commit()

            # Insert data into the table using SQL file
            with open('../../utils/scripts/sql/insert_personal_info_data.sql', 'r') as insert_data_file:
                insert_data_sql = insert_data_file.read()

            cursor.execute(insert_data_sql)
            conn.commit()

            print(f"Data inserted into {database} successfully")

    except pyodbc.Error as e:
        print(f"Database operation failed: {e}")
else:
    print("Failed to retrieve a valid random value.")
