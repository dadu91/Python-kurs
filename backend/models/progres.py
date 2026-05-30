from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Progres(Base):
    __tablename__ = "progres"

    id = Column(Integer, primary_key=True, index=True)
    korisnik_id = Column(Integer, ForeignKey("korisnik.id"), nullable=False)
    nivo = Column(Integer, default=1)
    bodovi = Column(Integer, default=1)
    datum_azuriranja = Column(DateTime, server_default=func.now())