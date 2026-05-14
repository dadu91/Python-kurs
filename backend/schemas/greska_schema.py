from pydantic import BaseModel
from typing import Optional

# Osnovna polja koja se ponavljaju
class GreskaBase(BaseModel):
    tip_greske: str
    opis: str

# Koristi Admin kad dodaje novu grešku
class GreskaCreate(GreskaBase):
    pass # Ovdje mu ne treba ništa više, id i ostalo ide automatski

# Šta vraćamo Adminu kad završi (sa ID-jem)
class GreskaOut(GreskaBase):
    id: int

    class Config:
        from_attributes = True

# Za PUT rutu (izmjena) - sve je Optional jer admin možda mijenja samo opis
class GreskaUpdate(BaseModel):
    tip_greske: Optional[str] = None
    opis: Optional[str] = None