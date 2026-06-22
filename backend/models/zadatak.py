from sqlalchemy import Column, Integer, Enum, ForeignKey, String
from database import Base


class Zadatak(Base):
    __tablename__ = "zadatak"

    id = Column(Integer, primary_key=True, index=True)
    lekcija_id = Column(Integer, ForeignKey("lekcija.id", ondelete="CASCADE"), nullable=False)
    redoslijed = Column(Integer, nullable=False, default=1)

    naziv = Column(String(255), nullable=True)
    opis = Column(String(1000), nullable=True)

    odgovor_a = Column(String(255), nullable=True)
    odgovor_b = Column(String(255), nullable=True)
    odgovor_c = Column(String(255), nullable=True)
    odgovor_d = Column(String(255), nullable=True)
    tacan_odgovor = Column(Integer, nullable=True)

    rjesenje = Column(String(5000), nullable=True)
    ocekivani_izlaz = Column(String(5000), nullable=True)

    tezina = Column(Enum("laka", "srednja", "teska"), default="laka")
    tip = Column(Enum("teorija", "prakticni", "quiz"), default="teorija")
