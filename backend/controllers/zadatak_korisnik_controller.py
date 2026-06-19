from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services import zadatak_korisnik_service
from repositories import zadatak_korisnik_repository
from schemas.zadatak_korisnik_schema import ZadatakKorisnikOut, ZadatakKorisnikCreate, GreskaKorisnikaOut

from utils.auth import get_current_user
from models.korisnik import Korisnik

router = APIRouter(prefix="/zadatak_korisnik", tags=["Zadatak korisnik"])

@router.get("/po-id/{id}",response_model=ZadatakKorisnikOut)
def citaj_zadatak_korisnik_preko_id(id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_service.get_zadatak_korisnik_id(db, id)

@router.get("/po-zadatak-id/{zadatak_id}",response_model=ZadatakKorisnikOut)
def citaj_zadatak_korisnik_preko_zadatak_id(zadatak_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_service.get_zadatak_korisnik_zadatak_id(db, zadatak_id)

@router.get("/po-korisnik-id/{korisnik_id}",response_model=ZadatakKorisnikOut)
def citaj_zadatak_korisnik_preko_korisnik_id(korisnik_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_service.get_zadatak_korisnik_korisnik_id(db, korisnik_id)

@router.get("/po-greska-id/{greska_id}",response_model=ZadatakKorisnikOut)
def citaj_zadatak_korisnik_preko_greska_id(greska_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_service.get_zadatak_korisnik_greska_id(db, greska_id)

@router.get("/po-tacno/{tacno}",response_model=List[ZadatakKorisnikOut])
def citaj_zadatak_korisnik_preko_tacno(tacno: bool, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_service.get_zadatak_korisnik_tacno(db, tacno)

@router.get("/tacni/po-korisnik/{korisnik_id}", response_model=List[ZadatakKorisnikOut])
def citaj_tacne_zadatke_korisnika(korisnik_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_repository.get_tacni_zadaci_by_korisnik(db, korisnik_id)

@router.get("/greske-po-korisniku/{korisnik_id}", response_model=List[GreskaKorisnikaOut])
def citaj_greske_korisnika(korisnik_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    rezultati = zadatak_korisnik_repository.get_greske_by_korisnik(db, korisnik_id)
    greske = []
    for zk, g, z, l in rezultati:
        greske.append(GreskaKorisnikaOut(
            id=zk.id,
            tip_greske=g.tip_greske,
            opis=g.opis,
            datum=zk.datum,
            zadatak_id=zk.zadatak_id,
            zadatak_redoslijed=z.redoslijed,
            lekcija_id=l.id,
            lekcija_naziv=l.naziv
        ))
    return greske

@router.post("/", response_model=ZadatakKorisnikOut)
def kreiraj_zadatak_korisnik(zadatak_korisnik: ZadatakKorisnikCreate, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_service.create_zadatak_korisnik(db, zadatak_korisnik)
