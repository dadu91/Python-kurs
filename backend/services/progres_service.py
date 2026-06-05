from sqlalchemy.orm import Session
from repositories import progres_repository
from fastapi import HTTPException, status
from models.progres import Progres
from schemas.progres_schema import ProgresCreate


BODOVI_LEKCIJA = 50

BODOVI_ZADATAK = {
    "laka": 10,
    "srednja": 20,
    "teska": 35
}

BODOVI_PO_NIVOU = 100


# GET
def get_progres_id(db: Session, progres_id: int):
    progres = progres_repository.get_progres_by_id(db, progres_id)
    if not progres:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progres sa ID-em {progres_id} nije pronadjen"
        )
    return progres


def get_progres_korisnik_id(db: Session, korisnik_id: int):
    progres = progres_repository.get_progres_by_korisnik_id(db, korisnik_id)
    if not progres:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progres sa ID-em korisnika {korisnik_id} nije pronadjen"
        )
    return progres


# POST
def create_progres(db: Session, data: ProgresCreate):
    postojeci = progres_repository.get_progres_by_korisnik_id(db, data.korisnik_id)
    if postojeci:
        return postojeci

    novi = Progres(korisnik_id=data.korisnik_id, nivo=1, bodovi=0)
    return progres_repository.create_progres(db, novi)


def izracunaj_nivo(bodovi: int) -> int:
    return bodovi // BODOVI_PO_NIVOU + 1


def get_or_create_progres(db: Session, korisnik_id: int):
    progres = progres_repository.get_progres_by_korisnik_id(db, korisnik_id)

    if progres:
        return progres

    novi = Progres(
        korisnik_id=korisnik_id,
        nivo=1,
        bodovi=0
    )

    return progres_repository.create_progres(db, novi)


def dodaj_bodove(db: Session, korisnik_id: int, broj_bodova: int):
    if broj_bodova <= 0:
        return get_or_create_progres(db, korisnik_id)

    progres = get_or_create_progres(db, korisnik_id)

    progres.bodovi += broj_bodova
    progres.nivo = izracunaj_nivo(progres.bodovi)

    return progres_repository.update_progres(db, progres)


def dodaj_bodove_za_lekciju(db: Session, korisnik_id: int):
    return dodaj_bodove(db, korisnik_id, BODOVI_LEKCIJA)


def dodaj_bodove_za_zadatak(db: Session, korisnik_id: int, tezina: str):
    broj_bodova = BODOVI_ZADATAK.get(tezina, 10)
    return dodaj_bodove(db, korisnik_id, broj_bodova)


# PUT
def update_progres(db: Session, progres: Progres):
    progres.nivo = izracunaj_nivo(progres.bodovi)
    return progres_repository.update_progres(db, progres)