from sqlalchemy import Column, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from database import Base

class ZadatakKorisnik(Base):
    __tablename__ = "zadatak_korisnik"

    id = Column(Integer, primary_key=True, index=True)
    zadatak_id = Column(Integer, ForeignKey("zadatak.id"), nullable=False)
    korisnik_id = Column(Integer, ForeignKey("korisnik.id"), nullable=False)
    greska_id = Column(Integer, ForeignKey("greska.id"))
    datum = Column(DateTime, server_default=func.now())
    tacno = Column(Boolean, nullable=False)