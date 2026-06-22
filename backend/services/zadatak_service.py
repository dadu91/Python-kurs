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
        naziv=zadatak.naziv,
        opis=zadatak.opis,

        odgovor_a=zadatak.odgovor_a,
        odgovor_b=zadatak.odgovor_b,
        odgovor_c=zadatak.odgovor_c,
        odgovor_d=zadatak.odgovor_d,
        tacan_odgovor=zadatak.tacan_odgovor,

        rjesenje=zadatak.rjesenje,
        ocekivani_izlaz=zadatak.ocekivani_izlaz,

        tezina=zadatak.tezina,
        tip=zadatak.tip
    )
    return zadatak_repository.create_zadatak(db, novi_zadatak)


def update_zadatak(db: Session, zadatak: Zadatak, zadatak_update: ZadatakUpdate):
    if zadatak_update.naziv is not None:
        zadatak.naziv = zadatak_update.naziv

    if zadatak_update.opis is not None:
        zadatak.opis = zadatak_update.opis

    if zadatak_update.odgovor_a is not None:
        zadatak.odgovor_a = zadatak_update.odgovor_a

    if zadatak_update.odgovor_b is not None:
        zadatak.odgovor_b = zadatak_update.odgovor_b

    if zadatak_update.odgovor_c is not None:
        zadatak.odgovor_c = zadatak_update.odgovor_c

    if zadatak_update.odgovor_d is not None:
        zadatak.odgovor_d = zadatak_update.odgovor_d

    if zadatak_update.tacan_odgovor is not None:
        zadatak.tacan_odgovor = zadatak_update.tacan_odgovor

    if zadatak_update.rjesenje is not None:
        zadatak.rjesenje = zadatak_update.rjesenje

    if zadatak_update.ocekivani_izlaz is not None:
        zadatak.ocekivani_izlaz = zadatak_update.ocekivani_izlaz

    if zadatak_update.tezina is not None:
        zadatak.tezina = zadatak_update.tezina

    if zadatak_update.tip is not None:
        zadatak.tip = zadatak_update.tip

    return zadatak_repository.update_zadatak(db, zadatak)


def delete_zadatak(db: Session, zadatak: Zadatak):
    zadatak_repository.delete_zadatak(db, zadatak)