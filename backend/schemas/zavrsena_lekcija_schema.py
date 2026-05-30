from pydantic import BaseModel
from datetime import datetime

class ZavrsenaLekcijaOut(BaseModel):
    id: int
    lekcija_id: int
    korisnik_id: int
    datum: datetime

    class Config:
        from_attributes = True

class ZavrsenaLekcijaCreate(BaseModel):
    lekcija_id: int
    korisnik_id: int