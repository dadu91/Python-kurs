from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ZadatakKorisnikOut(BaseModel):
    id: int
    zadatak_id: int 
    korisnik_id: int
    greska_id: Optional[int] = None
    tacno: bool 
    datum:datetime

    class Config:
        from_attributes = True

class GreskaKorisnikaOut(BaseModel):
    id: int
    tip_greske: str
    opis: Optional[str] = None
    datum: datetime
    zadatak_id: int
    zadatak_redoslijed: int
    lekcija_id: int
    lekcija_naziv: str

    class Config:
        from_attributes = True

class ZadatakKorisnikCreate(BaseModel):
    zadatak_id: int
    korisnik_id: int
    greska_id: Optional[int] = None
    tip_greske: Optional[str] = None
    tacno: bool