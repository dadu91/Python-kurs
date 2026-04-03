from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import korisnik_service


router = APIRouter(prefix="/korisnici", tags=["Korisnici"])

@router.get("/")
def citaj_sve_korisnike(db: Session = Depends(get_db)):
    return korisnik_service.get_korisnik_all(db)

@router.get("/{user_id}")
def nadji_korisnika_preko_id(user_id: int, db: Session = Depends(get_db)):
    # Ovde zovemo tvoj pametni servis
    return korisnik_service.get_korisnik_id(db, user_id)

@router.get("/pretraga/mail")
def nadji_korisnika_preko_maila(mail: str, db: Session = Depends(get_db)):
    return korisnik_service.get_korisnik_mail(db, mail)

@router.get("/pretraga/username")
def nadji_korisnika_preko_usernamea(username: str, db: Session = Depends(get_db)):
    return korisnik_service.get_korisnik_username(db, username)