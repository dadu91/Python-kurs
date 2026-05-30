from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services import progres_service
from schemas.progres_schema import ProgresOut

from utils.auth import get_current_user
from models.korisnik import Korisnik

router = APIRouter(prefix="/progres", tags=["Progres"])

@router.get("/po-id/{progres_id}", response_model=ProgresOut)
def nadji_progres_preko_id(progres_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return progres_service.get_progres_id(db, progres_id)

@router.get("/po-korisniku/{korisnik_id}", response_model=ProgresOut)
def nadji_progres_preko_korisnik_id(korisnik_id: int, db: Session = Depends(get_db), current_user: Korisnik = Depends(get_current_user)):
    return progres_service.get_progres_korisnik_id(db, korisnik_id)