from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.lekcija_schema import LekcijaOut, LekcijaCreate, LekcijaUpdate
from services import lekcija_service

from utils.auth import get_current_user
from models.korisnik import Korisnik

router = APIRouter(prefix="/lekcije", tags=["Lekcije"])


@router.get("/", response_model=list[LekcijaOut])
def vrati_lekcije(db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return lekcija_service.procitaj_sve_lekcije(db)


@router.get("/{lekcija_id}", response_model=LekcijaOut)
def vrati_lekciju_po_id(lekcija_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return lekcija_service.get_lekcija_id(db, lekcija_id)


@router.post("/", response_model=LekcijaOut, status_code=status.HTTP_201_CREATED)
def dodaj_lekciju(lekcija: LekcijaCreate, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return lekcija_service.create_lekcija(db, lekcija)


@router.put("/{lekcija_id}", response_model=LekcijaOut)
def izmijeni_lekciju(lekcija_id: int, lekcija_update: LekcijaUpdate, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)
):
    lekcija = lekcija_service.get_lekcija_id(db, lekcija_id)
    return lekcija_service.update_lekcija(db, lekcija, lekcija_update)


@router.delete("/{lekcija_id}", status_code=status.HTTP_204_NO_CONTENT)
def obrisi_lekciju(lekcija_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    lekcija = lekcija_service.get_lekcija_id(db, lekcija_id)
    lekcija_service.delete_lekcija(db, lekcija)