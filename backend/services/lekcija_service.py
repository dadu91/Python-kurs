from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.lekcija_model import Lekcija
from repositories import lekcija_repository
from schemas.lekcija_schema import LekcijaCreate, LekcijaUpdate


def procitaj_sve_lekcije(db: Session):
    return lekcija_repository.get_all_lekcije(db)


def get_lekcija_id(db: Session, lekcija_id: int):
    lekcija = lekcija_repository.get_lekcija_by_id(db, lekcija_id)
    if not lekcija:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lekcija sa ID-em {lekcija_id} nije pronađena."
        )
    return lekcija


def create_lekcija(db: Session, lekcija: LekcijaCreate):
    if lekcija_repository.get_lekcija_by_naziv(db, lekcija.naziv):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lekcija sa ovim nazivom već postoji."
        )

    nova_lekcija = Lekcija(
        naziv=lekcija.naziv,
        redosljed=lekcija.redosljed,
        opis=lekcija.opis
    )

    return lekcija_repository.create_lekcija(db, nova_lekcija)


def update_lekcija(db: Session, lekcija: Lekcija, lekcija_update: LekcijaUpdate):
    if lekcija_update.naziv is not None:
        lekcija.naziv = lekcija_update.naziv

    if lekcija_update.redosljed is not None:
        lekcija.redosljed = lekcija_update.redosljed

    if lekcija_update.opis is not None:
        lekcija.opis = lekcija_update.opis

    return lekcija_repository.update_lekcija(db, lekcija)


def delete_lekcija(db: Session, lekcija: Lekcija):
    lekcija_repository.delete_lekcija(db, lekcija)