from sqlalchemy import Column, Integer, String, Text
from backend.database import Base


class Lekcija(Base):
    __tablename__ = "lekcija"

    id = Column(Integer, primary_key=True, index=True)
    naziv = Column(String(100), unique=True, nullable=False)
    redosljed = Column(Integer, nullable=False)
    opis = Column(Text, nullable=True)