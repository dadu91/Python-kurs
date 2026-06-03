from sqlalchemy import Column, Integer, Enum, ForeignKey
from database import Base


class Zadatak(Base):
    __tablename__ = "zadatak"

    id = Column(Integer, primary_key=True, index=True)
    lekcija_id = Column(Integer, ForeignKey("lekcija.id", ondelete="CASCADE"), nullable=False)
    tezina = Column(Enum("laka", "srednja", "teska"), default="laka")
    tip = Column(Enum("teorija", "prakticni", "quiz"), default="teorija")
