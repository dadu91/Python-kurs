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
    username: str
    mail: str
    uloga: str
    datum_reg: datetime
    last_login_at: Optional[datetime] = None
    ukupno_vrijeme: int

    class Config:
        from_attributes = True #Ovo omogućava Pydanticu da čita SQLAlchemy modele

class KorisnikUpdate(BaseModel):
    username: Optional[str] = None
    mail: Optional[EmailStr] = None
    password: Optional[str] = None

class VrijemeUpdate(BaseModel):
    sekunde: int