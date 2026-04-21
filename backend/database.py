import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Učitava DATABASE_URL iz tvog .env fajla
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Inicijalizacija baze
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Funkcija za dobijanje sesije (dependency injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()