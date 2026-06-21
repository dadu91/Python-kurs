from pydantic import BaseModel
from typing import Optional


class ZadatakOut(BaseModel):
    id: int
    lekcija_id: int
    redoslijed: int

    naziv: Optional[str] = None
    opis: Optional[str] = None

    odgovor_a: Optional[str] = None
    odgovor_b: Optional[str] = None
    odgovor_c: Optional[str] = None
    odgovor_d: Optional[str] = None
    tacan_odgovor: Optional[int] = None

    rjesenje: Optional[str] = None
    ocekivani_izlaz: Optional[str] = None

    tezina: str
    tip: str

    class Config:
        from_attributes = True


class ZadatakCreate(BaseModel):
    lekcija_id: int

    naziv: str
    opis: Optional[str] = None

    odgovor_a: Optional[str] = None
    odgovor_b: Optional[str] = None
    odgovor_c: Optional[str] = None
    odgovor_d: Optional[str] = None
    tacan_odgovor: Optional[int] = None

    rjesenje: Optional[str] = None
    ocekivani_izlaz: Optional[str] = None

    tezina: Optional[str] = "laka"
    tip: Optional[str] = "teorija"


class ZadatakUpdate(BaseModel):
    naziv: Optional[str] = None
    opis: Optional[str] = None

    odgovor_a: Optional[str] = None
    odgovor_b: Optional[str] = None
    odgovor_c: Optional[str] = None
    odgovor_d: Optional[str] = None
    tacan_odgovor: Optional[int] = None

    rjesenje: Optional[str] = None
    ocekivani_izlaz: Optional[str] = None

    tezina: Optional[str] = None
    tip: Optional[str] = None