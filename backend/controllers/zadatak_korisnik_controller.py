from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services import zadatak_korisnik_service
from repositories import zadatak_korisnik_repository
from schemas.zadatak_korisnik_schema import ZadatakKorisnikOut, ZadatakKorisnikCreate

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

@router.get("/aktivnost/sedmica/{korisnik_id}")
def aktivnost_sedmica(korisnik_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    from datetime import datetime, timedelta
    data = zadatak_korisnik_repository.get_aktivnost_sedmica(db, korisnik_id)
    aktivnost_map = {str(row.dan): row.broj for row in data}
    names = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"]
    result = []
    for i in range(6, -1, -1):
        dan = (datetime.now() - timedelta(days=i)).date()
        result.append({"day": names[dan.weekday()], "value": aktivnost_map.get(str(dan), 0)})
    return result

@router.get("/netacni/po-korisnik/{korisnik_id}", response_model=List[ZadatakKorisnikOut])
def citaj_netacne_zadatke_korisnika(korisnik_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_repository.get_netacni_zadaci_by_korisnik(db, korisnik_id)

@router.get("/netacni/detalji/{korisnik_id}")
def netacni_detalji(korisnik_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    data = zadatak_korisnik_repository.get_netacni_detalji(db, korisnik_id)
    return [
        {
            "id": r.id,
            "zadatak_naziv": r.zadatak_naziv,
            "zadatak_tip": r.zadatak_tip,
            "zadatak_redoslijed": r.zadatak_redoslijed,
            "lekcija_id": r.lekcija_id,
            "lekcija_naziv": r.lekcija_naziv,
            "datum": str(r.datum)[:10] if r.datum else None,
        }
        for r in data
    ]

@router.get("/netacni/po-lekcijama/{korisnik_id}")
def netacni_po_lekcijama(korisnik_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    data = zadatak_korisnik_repository.get_netacni_by_lekcija(db, korisnik_id)
    return [{"lekcija_naziv": r.lekcija_naziv, "broj": r.broj} for r in data]

@router.delete("/netacni/{korisnik_id}/{zadatak_id}")
def obrisi_netacni_zadatak(korisnik_id: int, zadatak_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    zadatak_korisnik_repository.delete_netacni_by_korisnik_zadatak(db, korisnik_id, zadatak_id)
    return {"ok": True}

@router.post("/", response_model=ZadatakKorisnikOut)
def kreiraj_zadatak_korisnik(zadatak_korisnik: ZadatakKorisnikCreate, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_korisnik_service.create_zadatak_korisnik(db, zadatak_korisnik)