from pydantic import BaseModel, Field
from typing import Optional

class KodIzvrsavanjeCreate(BaseModel):
    kod: str = Field(..., min_length=1, description="Python kod za izvršavanje")

class IzvrsavanjeGreskaOut(BaseModel):
    tip: str
    poruka: str

class KodIzvrsavanjeOut(BaseModel):
    output: Optional[str] = None
    greska: Optional[IzvrsavanjeGreskaOut] = None