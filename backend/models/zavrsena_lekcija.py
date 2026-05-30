from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class ZavrsenaLekcija(Base):
    __tablename__ = "zavrsena_lekcija"

    id = Column(Integer, primary_key=True, index=True)
    lekcija_id = Column(Integer, ForeignKey("lekcija.id"), nullable=False)
    korisnik_id = Column(Integer, ForeignKey("korisnik.id"), nullable=False)
    datum = Column(DateTime, server_default=func.now())