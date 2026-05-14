from sqlalchemy import Column, Integer, String, Text
from database import Base

class Greska(Base):
    __tablename__ = "greska"

    id = Column(Integer, primary_key=True, index=True)
    tip_greske = Column(String(50), nullable=False)
    opis = Column(Text)