from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.zadatak import Zadatak
from repositories import zadatak_repository
from schemas.zadatak_schema import ZadatakCreate, ZadatakUpdate


def procitaj_sve_zadatke(db: Session):
    return zadatak_repository.get_all_zadaci(db)


def get_zadatak_id(db: Session, zadatak_id: int):
    zadatak = zadatak_repository.get_zadatak_by_id(db, zadatak_id)
    if not zadatak:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zadatak sa ID-em {zadatak_id} nije pronađen."
        )
    return zadatak


def get_zadaci_po_lekciji(db: Session, lekcija_id: int):
    return zadatak_repository.get_zadaci_by_lekcija_id(db, lekcija_id)


def create_zadatak(db: Session, zadatak: ZadatakCreate):
    novi_zadatak = Zadatak(
        lekcija_id=zadatak.lekcija_id,
        tezina=zadatak.tezina,
        tip=zadatak.tip
    )
    return zadatak_repository.create_zadatak(db, novi_zadatak)


def update_zadatak(db: Session, zadatak: Zadatak, zadatak_update: ZadatakUpdate):
    if zadatak_update.tezina is not None:
        zadatak.tezina = zadatak_update.tezina
    if zadatak_update.tip is not None:
        zadatak.tip = zadatak_update.tip
    return zadatak_repository.update_zadatak(db, zadatak)


def delete_zadatak(db: Session, zadatak: Zadatak):
    zadatak_repository.delete_zadatak(db, zadatak)
