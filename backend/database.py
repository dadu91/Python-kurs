from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


DATABASE_URL = "mysql+pymysql://root:helt1234@localhost:3306/python_kurs"

# salje SQL upite
engine = create_engine(DATABASE_URL)

# konekcija sa bazom
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# base - roditelj za module
Base = declarative_base()

# database.py

def get_db():
    db = SessionLocal()
    try:
        yield db  # 'yield' predaje kontrolu kontroleru, ali ne gasi funkciju
    finally:
        db.close()