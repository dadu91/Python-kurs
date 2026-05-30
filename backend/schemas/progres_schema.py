from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProgresBase(BaseModel):
    nivo: int
    bodovi: int

class ProgresOut(ProgresBase):
    id: int
    korisnik_id: int
    datum_azuriranja: datetime
    
    class Config:
        from_attributes = True