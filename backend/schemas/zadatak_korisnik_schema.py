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

class ZadatakKorisnikCreate(BaseModel):
    zadatak_id: int
    korisnik_id: int
    greska_id: Optional[int] = None
    tip_greske: Optional[str] = None
    tacno: bool