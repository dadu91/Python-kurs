from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services import zavrsena_lekcija_service
from schemas.zavrsena_lekcija_schema import ZavrsenaLekcijaOut, ZavrsenaLekcijaCreate

from utils.auth import get_current_user
from models.korisnik import Korisnik

router = APIRouter(prefix="/zavrsena_lekcija", tags=["Zavrsena lekcija"])

@router.get("/", response_model=List[ZavrsenaLekcijaOut])
def citaj_sve_zavrsene_lekcije(db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zavrsena_lekcija_service.get_zavrsena_lekcija_all(db)

@router.get("/po-id/{id}", response_model=ZavrsenaLekcijaOut)
def citaj_zavrsenu_lekciju_preko_id(id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zavrsena_lekcija_service.get_zavrsena_lekcija_id(db, id)

@router.get("/po-korisnik-id/{korisnik_id}", response_model=List[ZavrsenaLekcijaOut])
def citaj_zavrsenu_lekciju_preko_korisnik_id(korisnik_id:int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zavrsena_lekcija_service.get_zavrsena_lekcija_korisnik_id(db, korisnik_id)

@router.get("/po-lekcija-id/{lekcija_id}", response_model=ZavrsenaLekcijaOut)
def citaj_zavrsenu_lekciju_preko_lekcija_id(lekcija_id:int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zavrsena_lekcija_service.get_zavrsena_lekcija_lekcija_id(db, lekcija_id)

@router.post("/", response_model=ZavrsenaLekcijaOut)
def kreiraj_zavrsenu_lekciju(zavrsena_lekcija: ZavrsenaLekcijaCreate, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return zavrsena_lekcija_service.create_zavrsena_lekcija(db, zavrsena_lekcija)