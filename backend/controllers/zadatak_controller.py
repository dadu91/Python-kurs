from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas.zadatak_schema import ZadatakOut, ZadatakCreate, ZadatakUpdate
from services import zadatak_service

from utils.auth import get_current_user
from models.korisnik import Korisnik

router = APIRouter(prefix="/zadaci", tags=["Zadaci"])


@router.get("/", response_model=List[ZadatakOut])
def vrati_zadatke(db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_service.procitaj_sve_zadatke(db)


@router.get("/{zadatak_id}", response_model=ZadatakOut)
def vrati_zadatak_po_id(zadatak_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_service.get_zadatak_id(db, zadatak_id)


@router.get("/po-lekciji/{lekcija_id}", response_model=List[ZadatakOut])
def vrati_zadatke_po_lekciji(lekcija_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_service.get_zadaci_po_lekciji(db, lekcija_id)


@router.post("/", response_model=ZadatakOut, status_code=status.HTTP_201_CREATED)
def dodaj_zadatak(zadatak: ZadatakCreate, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zadatak_service.create_zadatak(db, zadatak)


@router.put("/{zadatak_id}", response_model=ZadatakOut)
def izmijeni_zadatak(zadatak_id: int, zadatak_update: ZadatakUpdate, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    zadatak = zadatak_service.get_zadatak_id(db, zadatak_id)
    return zadatak_service.update_zadatak(db, zadatak, zadatak_update)


@router.delete("/{zadatak_id}", status_code=status.HTTP_204_NO_CONTENT)
def obrisi_zadatak(zadatak_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    zadatak = zadatak_service.get_zadatak_id(db, zadatak_id)
    zadatak_service.delete_zadatak(db, zadatak)
