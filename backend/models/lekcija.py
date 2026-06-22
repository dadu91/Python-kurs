from sqlalchemy import Column, Integer, String, Text
from database import Base


class Lekcija(Base):
    __tablename__ = "lekcija"

    id = Column(Integer, primary_key=True, index=True)
    naziv = Column(String(100), unique=True, nullable=False)
    redoslijed = Column(Integer, nullable=False)
    opis = Column(Text, nullable=True)
    ciljevi = Column(Text, nullable=True)
    primjer_koda = Column(Text, nullable=True)
    objasnjenje_koda = Column(Text, nullable=True)
    trajanje = Column(String(50), nullable=True)
    nivo = Column(String(50), nullable=True)