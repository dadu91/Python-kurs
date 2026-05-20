from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models.korisnik import Korisnik
from utils.auth import get_current_user

from database import get_db
from services import korisnik_service
from schemas.korisnik_schema import KorisnikOut, KorisnikCreate, KorisnikUpdate

router = APIRouter(prefix="/korisnik", tags=["Korisnik"])

@router.get("/", response_model=List[KorisnikOut])
def citaj_sve_korisnike(db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return korisnik_service.get_korisnik_all(db)

@router.get("/pretraga/mail", response_model=KorisnikOut)
def nadji_korisnika_preko_maila(mail: str, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return korisnik_service.get_korisnik_mail(db, mail)

@router.get("/pretraga/username", response_model=KorisnikOut)
def nadji_korisnika_preko_usernamea(username: str, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return korisnik_service.get_korisnik_username(db, username)

@router.get("/{user_id}", response_model=KorisnikOut)
def nadji_korisnika_preko_id(user_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    # Ovde zovemo tvoj pametni servis
    return korisnik_service.get_korisnik_id(db, user_id)

@router.post("/", response_model=KorisnikOut)
def kreiraj_korisnika(korisnik: KorisnikCreate, db: Session = Depends(get_db)):
    return korisnik_service.create_korisnik(db, korisnik)

@router.put("/{user_id}", response_model=KorisnikOut)
def izmijeni_korsnika(user_id: int, korisnik: KorisnikUpdate, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Zabranjeno mijenjanje korisnika jer se SWT tokeni ne poklapaju.")
    return korisnik_service.update_korisnik(db, korisnik_service.get_korisnik_id(db, user_id), korisnik)

@router.delete("/{user_id}", status_code=204)
def izbrisi_korisnika(user_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Zabranjeno brisanje korisnika jer se SWT tokeni ne poklapaju.")
            
    korisnik_service.delete_korisnik(db, korisnik_service.get_korisnik_id(db,user_id))