import psycopg2
from config import load_config

config = load_config()

def connect(config):
    """ Connect to the PostgreSQL database server """
    try:
        with psycopg2.connect(**config) as conn:
            print('Connected.')
            return conn
    except (psycopg2.DatabaseError, Exception) as error:
        print(error)

def get_db_connection(cursor_factory=None):
    try:
        conn = psycopg2.connect(
            host=config['host'],
            database=config['database'],
            user=config['user'],
            password=config['password']
        )
        cur = conn.cursor(cursor_factory=cursor_factory)
        return cur, conn
    except psycopg2.Error as e:
        raise