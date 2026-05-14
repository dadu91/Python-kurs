from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services import greska_service
from schemas.greska_schema import GreskaOut, GreskaCreate, GreskaUpdate

router = APIRouter(prefix="/greska", tags=["Greska"])

@router.post("/", response_model=GreskaOut)
def kreiraj_gresku(greska: GreskaCreate, db: Session = Depends(get_db)):
    return greska_service.create_greska(db, greska)

@router.put("/{greska_id}", response_model=GreskaOut)
def izmijeni_gresku(greska_id: int, greska: GreskaUpdate, db: Session = Depends(get_db)):
    return greska_service.update_greska(db, greska_id, greska)

@router.delete("/{greska_id}", status_code=204)
def izbrisi_gresku(greska_id: int, db: Session = Depends(get_db)):
    greska_service.delete_greska(db, greska_id)