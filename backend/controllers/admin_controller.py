from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from utils.auth import get_current_admin
from schemas.korisnik_schema import KorisnikOut
from services import korisnik_service

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/korisnici", response_model=List[KorisnikOut])
def svi_korisnici(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    return korisnik_service.get_korisnik_all(db)

@router.delete("/korisnici/{user_id}", status_code=204)
def obrisi_korisnika(user_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    korisnik_service.delete_korisnik(db, korisnik_service.get_korisnik_id(db, user_id))

@router.put("/korisnici/{user_id}/uloga")
def promijeni_ulogu(user_id: int, uloga: str, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    korisnik = korisnik_service.get_korisnik_id(db, user_id)
    korisnik.uloga = uloga
    db.commit()
    db.refresh(korisnik)
    return korisnik