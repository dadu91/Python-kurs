from sqlalchemy.orm import Session
from repositories import greska_repository
from fastapi import HTTPException, status
from models.greska import Greska

from schemas.greska_schema import GreskaUpdate, GreskaCreate

# POST
def create_greska(db: Session, greska: GreskaCreate):
    if greska_repository.get_greska_by_tip(db, greska.tip_greske):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Vec postoji greska sa tipom: {greska.tip_greske}"
        )
    
    nova_greska = Greska(
        tip_greske = greska.tip_greske,
        opis = greska.opis
    )
    return greska_repository.create_greska(db, nova_greska)

# PUT
def update_greska(db: Session, greska_id: int, greska_update: GreskaUpdate):
    greska = greska_repository.get_greska_by_id(db, greska_id)
    if not greska:
        raise HTTPException(status_code=404, detail="Greška nije pronađena")
    
    if greska_update.tip_greske:
        greska.tip_greske = greska_update.tip_greske
    if greska_update.opis:
        greska.opis = greska_update.opis
    
    return greska_repository.update_greska(db, greska)

# DELETE
def delete_greska(db: Session, greska_id: int):
    greska = greska_repository.get_greska_by_id(db, greska_id)
    if not greska:
        raise HTTPException(status_code=404, detail="Greška nije pronađena")
    greska_repository.delete_greska(db, greska)