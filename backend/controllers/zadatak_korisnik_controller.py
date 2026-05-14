from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services import zadatak_korisnik_service
from schemas.zadatak_korisnik_schema import ZadatakKorisnikOut, ZadatakKorisnikCreate

router = APIRouter(prefix="/zadatak_korisnik", tags=["Zadatak korisnik"])

@router.get("/po-id/{id}",response_model=ZadatakKorisnikOut)
def citaj_zadatak_korisnik_preko_id(id: int, db: Session = Depends(get_db)):
    return zadatak_korisnik_service.get_zadatak_korisnik_id(db, id)

@router.get("/po-zadatak-id/{zadatak_id}",response_model=ZadatakKorisnikOut)
def citaj_zadatak_korisnik_preko_zadatak_id(zadatak_id: int, db: Session = Depends(get_db)):
    return zadatak_korisnik_service.get_zadatak_korisnik_zadatak_id(db, zadatak_id)

@router.get("/po-korisnik-id/{korisnik_id}",response_model=ZadatakKorisnikOut)
def citaj_zadatak_korisnik_preko_korisnik_id(korisnik_id: int, db: Session = Depends(get_db)):
    return zadatak_korisnik_service.get_zadatak_korisnik_korisnik_id(db, korisnik_id)

@router.get("/po-greska-id/{greska_id}",response_model=ZadatakKorisnikOut)
def citaj_zadatak_korisnik_preko_greska_id(greska_id: int, db: Session = Depends(get_db)):
    return zadatak_korisnik_service.get_zadatak_korisnik_greska_id(db, greska_id)

@router.get("/po-tacno/{tacno}",response_model=List[ZadatakKorisnikOut])
def citaj_zadatak_korisnik_preko_tacno(tacno: bool, db: Session = Depends(get_db)):
    return zadatak_korisnik_service.get_zadatak_korisnik_tacno(db, tacno)

@router.post("/", response_model=ZadatakKorisnikOut)
def kreiraj_zadatak_korisnik(zadatak_korisnik: ZadatakKorisnikCreate, db: Session = Depends(get_db)):
    return zadatak_korisnik_service.create_zadatak_korisnik(db, zadatak_korisnik)