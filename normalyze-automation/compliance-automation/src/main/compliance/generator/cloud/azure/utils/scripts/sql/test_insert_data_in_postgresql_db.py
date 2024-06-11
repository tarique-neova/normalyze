import logging
import psycopg2
import json


# Configure logging
logging.basicConfig(filename='app.log', level=logging.DEBUG)


def get_random_value():
    try:
        with open("random_value.txt", "r") as file:
            random_value_dict = json.load(file)
        return random_value_dict.get("value", "")
    except (FileNotFoundError, json.JSONDecodeError) as e:
        logging.error(f"Error reading or parsing the random value file: {e}")
        return ""


def create_connection(db_config):
    try:
        logging.info(f"Connecting to server: {db_config['host']}")
        logging.info(f"Using database: {db_config['dbname']}")
        return psycopg2.connect(**db_config)
    except psycopg2.Error as e:
        logging.error(f"Unable to connect to the database: {e}")
        raise ConnectionError(f"Unable to connect to the database: {e}")


def drop_table(cursor, table_name):
    try:
        cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
    except psycopg2.Error as e:
        logging.error(f"Error dropping table: {e}")
        raise RuntimeError(f"Error dropping table: {e}")


def create_table(cursor, query):
    try:
        cursor.execute(query)
    except psycopg2.Error as e:
        logging.error(f"Error creating table: {e}")
        raise RuntimeError(f"Error creating table: {e}")


def insert_data(cursor, query):
    try:
        cursor.execute(query)
    except psycopg2.Error as e:
        logging.error(f"Error inserting data: {e}")
        raise RuntimeError(f"Error inserting data: {e}")


def main():
    random_value = get_random_value()
    if not random_value:
        logging.error("Random value not found, cannot establish connection.")
        print("Random value not found, cannot establish connection.")
        return

    db_config = {
        'dbname': random_value,
        'user': f"neovatest@{random_value}",
        'password': 'Normalyze#12345',
        'host': f"{random_value}.postgres.database.azure.com",
        'port': '5432'
    }

    try:
        with create_connection(db_config) as conn:
            with conn.cursor() as cursor:
                # Drop the table if it already exists
                drop_table(cursor, 'Personal_Information')
                conn.commit()

                # Load SQL queries from files
                with open('../../utils/scripts/sql/create_personal_info_table.sql', 'r') as create_file:
                    create_table_query = create_file.read()

                with open('../../utils/scripts/sql/insert_personal_info_data.sql', 'r') as insert_file:
                    insert_data_query = insert_file.read()

                # Execute create table query
                create_table(cursor, create_table_query)
                conn.commit()
                print("Table created successfully")

                # Execute insert data query from file
                insert_data(cursor, insert_data_query)
                conn.commit()
                print("Data inserted successfully")

    except (RuntimeError, psycopg2.Error) as e:
        logging.error(f"Error: {e}")
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
