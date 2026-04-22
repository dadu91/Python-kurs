from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services import korisnik_service
from schemas.korisnik_schema import KorisnikOut


router = APIRouter(prefix="/korisnici", tags=["Korisnici"])

@router.get("/", response_model=List[KorisnikOut])
def citaj_sve_korisnike(db: Session = Depends(get_db)):
    return korisnik_service.get_korisnik_all(db)



@router.get("/pretraga/mail", response_model=KorisnikOut)
def nadji_korisnika_preko_maila(mail: str, db: Session = Depends(get_db)):
    return korisnik_service.get_korisnik_mail(db, mail)

@router.get("/pretraga/username", response_model=KorisnikOut)
def nadji_korisnika_preko_usernamea(username: str, db: Session = Depends(get_db)):
    return korisnik_service.get_korisnik_username(db, username)

@router.get("/{user_id}", response_model=KorisnikOut)
def nadji_korisnika_preko_id(user_id: int, db: Session = Depends(get_db)):
    # Ovde zovemo tvoj pametni servis
    return korisnik_service.get_korisnik_id(db, user_id)