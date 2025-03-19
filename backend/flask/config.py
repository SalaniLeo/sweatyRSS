import os
import dotenv

dotenv.load_dotenv()

def load_config():
    config = {
        "host": os.getenv("DATABASE_IP"),
        "database": os.getenv("DATABASE_NAME"),
        "user": os.getenv("DATABASE_USER"),
        "password": os.getenv("DATABASE_PASSWORD"),
    }

    return config