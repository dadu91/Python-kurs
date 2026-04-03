from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base # Proveri da li je putanja do database.py tačna

class Korisnik(Base):
    __tablename__ = "korisnik"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    mail = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    datum_reg = Column(DateTime, server_default=func.now())