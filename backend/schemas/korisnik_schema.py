from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# osnova, ono sto svi imaju
class KorisnikBase(BaseModel):
    username: str
    mail: EmailStr

# sema za kreiranje
class KorisnikCreate(KorisnikBase):
    password: str # cista lozinka koja ce kasnije biti hashovana

# sema za prikaz
class KorisnikOut(KorisnikBase):
    id: int
    datum_reg: datetime

    class Config:
        from_attributes = True #Ovo omogućava Pydanticu da čita SQLAlchemy modele

class KornisnikUpdate(BaseModel):
    username: Optional[str] = None
    mail: Optional[EmailStr] = None
    password: Optional[str] = None